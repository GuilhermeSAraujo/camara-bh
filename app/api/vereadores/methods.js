import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
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

export async function findById(_id) {
  check(_id, String);
  return VereadoresCollection.findOneAsync(_id);
}

Meteor.methods({
  'Vereadores.create': create,
  'Vereadores.update': update,
  'Vereadores.remove': remove,
  'Vereadores.find': findById
});
