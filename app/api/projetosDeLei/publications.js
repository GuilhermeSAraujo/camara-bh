import { Meteor } from 'meteor/meteor';
import { ProjetosDeLeiCollection } from './collection';

Meteor.publish('allProjetosDeLeis', () => ProjetosDeLeiCollection.find({}));
