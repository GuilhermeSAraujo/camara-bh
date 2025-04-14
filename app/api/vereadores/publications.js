import { Meteor } from 'meteor/meteor';
import { VereadoresCollection } from './collection';

Meteor.publish('vereadores', () => VereadoresCollection.find());
Meteor.publish('vereador', function(id) {
    check(id, String);
    return VereadoresCollection.find({
      $or: [
        { idVereador: id },
        { '_id._str': id },
        { _id: id }
      ]
    });
});