import { Meteor } from 'meteor/meteor';
import { VereadoresCollection } from './collection';

Meteor.publish('allVereadoress', function publishVereadoress() {
  return VereadoresCollection.find({});
});
