import { Mongo } from 'meteor/mongo';

export const ProjetosDeLeiCollection = new Mongo.Collection('projetosDeLei');

export const ProjetosDeLeiStatus = {
  RETIRADA: 'Retirada',
  LEI: 'Lei',
  REJEITADA: 'Rejeitada',
};
