import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/quave:synced-cron';

SyncedCron.config({
  log: true,
});

Meteor.startup(() => {
  SyncedCron.add({
    name: 'Sync metrics',
    schedule(parser) {
      return parser.text('every 1 minute');
    },
    job: async () => {
      // eslint-disable-next-line no-console
      console.log(`Staring sync metrics - ${new Date()}`);
      // eslint-disable-next-line no-console
      console.log(`End sync metrics - ${new Date()}`);
    },
  });
  SyncedCron.start();
});
