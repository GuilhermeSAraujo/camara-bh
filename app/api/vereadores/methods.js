import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { VereadoresCollection } from './collection';

export async function create(data) {
  return VereadoresCollection.insertAsync({ ...data });
}

export async function update(_id, data) {
  check(_id, String);
  return VereadoresCollection.updateAsync(_id, { ...data });
}

export async function remove(_id) {
  check(_id, String);
  return VereadoresCollection.removeAsync(_id);
}

export async function findById({ id }) {
  check(id, Match.Any);

  const vereador = await VereadoresCollection.findOneAsync({
    $or: [{ idVereador: id }, { _id: id }],
  });

  return vereador;
}

export async function list() {
  const result = await VereadoresCollection.find(
    {},
    { sort: { name: 1 } }
  ).fetchAsync();
  return result;
}

Meteor.methods({
  'Vereadores.create': create,
  'Vereadores.update': update,
  'Vereadores.remove': remove,
  'Vereadores.findById': findById,
  'Vereadores.list': list,
});
