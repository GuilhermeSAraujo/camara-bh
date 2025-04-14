import { Meteor } from 'meteor/meteor';
import { VereadoresCollection } from './collection';

export async function list() {
  return VereadoresCollection.find(
    {},
    { fields: { name: 1 }, sort: { name: 1 } }
  ).fetchAsync();
}

Meteor.methods({
  'Vereadores.list': list,
});
