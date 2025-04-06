import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/quave:synced-cron';

SyncedCron.config({
  log: true,
});

Meteor.startup(() => {
  SyncedCron.add({
    name: 'Sync Vereadores',
    schedule(parser) {
      return parser.text('every 4 years');
    },
    job: async () => {
      // eslint-disable-next-line no-console
      console.log(`Staring sync Vereadores - ${new Date()}`);

      // eslint-disable-next-line no-console
      console.log(`End sync Vereadores - ${new Date()}`);
    },
    allowParallelExecution: true,
  });
  SyncedCron.start();
});
