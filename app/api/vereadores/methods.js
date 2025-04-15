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

  try {
    let vereador = await VereadoresCollection.findOneAsync({ idVereador: id });

    if (!vereador) {
      vereador = await VereadoresCollection.findOneAsync({
        $or: [
          { _id: id }, // Para _id: "..."
          { _id: { _str: id } }, // Para quando recebemos o _str diretamente
          { _id: new Mongo.ObjectID(id) }, // Para quando precisamos converter para ObjectID
        ],
      });
    }

    if (!vereador) {
      vereador = await VereadoresCollection.findOneAsync({
        _id: new Mongo.ObjectID(id),
      });
    }

    return vereador;
  } catch (error) {
    return null;
  }
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
