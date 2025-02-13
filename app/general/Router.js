import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { RoutePaths } from './RoutePaths';

import { Dashboard } from '../pages/Dashboard';
import { NotFound } from '../pages/NotFound';
import { Login } from '../pages/Login';

import { LoggedLayout } from '../layouts/LoggedLayout';
import { AuthLayout } from '../layouts/AuthLayout';

import { NoSelectedTeam } from './NoSelectedTeam';

export const router = createBrowserRouter([
  {
    path: RoutePaths.LOGIN,
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
  {
    element: <LoggedLayout />,
    children: [
      {
        path: RoutePaths.APP,
        element: <NoSelectedTeam />,
      },
      {
        path: RoutePaths.DASHBOARD,
        element: <Dashboard />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
