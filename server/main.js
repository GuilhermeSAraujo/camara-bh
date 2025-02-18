import { Meteor } from 'meteor/meteor';
import '../app/api/projetosDeLei';
import '../app/api/vereadores';

Meteor.startup(async () => {
  console.log('Starting application');
});
