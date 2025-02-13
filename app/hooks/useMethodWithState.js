import { Meteor } from 'meteor/meteor';
import { useEffect, useReducer } from 'react';

const ActionsTypes = {
  START: 'start',
  SUCCESS: 'success',
  ERROR: 'error',
};

const DEFAULT_VALUES = {
  isLoading: false,
  data: undefined,
  error: undefined,
};
function reducer(state, action) {
  switch (action.type) {
    case ActionsTypes.START:
      return {
        ...state,
        isLoading: true,
      };
    case ActionsTypes.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        data: DEFAULT_VALUES.data,
      };
    case ActionsTypes.SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: DEFAULT_VALUES.error,
        data: action.payload,
      };
    default:
      return state;
  }
}

export function useMethodWithState({
  method,
  params,
  onError,
  onSuccess,
  dependencyArray = [],
  conditionToRun = true,
}) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_VALUES);

  const call = async () => {
    if (!conditionToRun) return;

    dispatch({ type: ActionsTypes.START });
    try {
      const res = await Meteor.callAsync(method, params);
      dispatch({ type: ActionsTypes.SUCCESS, payload: res });
      onSuccess?.(res);
    } catch (err) {
      dispatch({ type: ActionsTypes.ERROR, payload: err });
      onError?.(err);
    }
  };

  useEffect(() => {
    call();
  }, [...dependencyArray, conditionToRun]);

  return [
    state.data,
    { isLoading: state.isLoading, error: state.error, refetch: call },
  ];
}
