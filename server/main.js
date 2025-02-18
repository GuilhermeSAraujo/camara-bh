import { Meteor } from 'meteor/meteor';
import '../app/api/projetosDeLei';
import '../app/api/vereadores';
import '../app/infra/cron';

Meteor.startup(async () => {
  console.log('Starting application');
});
