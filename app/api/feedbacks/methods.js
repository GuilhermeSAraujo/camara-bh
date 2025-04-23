import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { FeedbacksCollection } from './collection';

async function create({ email, name, feedback }) {
  check(email, Match.Optional(String));
  check(name, String);
  check(feedback, String);

  await FeedbacksCollection.insertAsync({
    email,
    name,
    feedback,
    createdAt: Date.now(),
  });
}

Meteor.methods({
  'Feedbacks.create': create,
});
