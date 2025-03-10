import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { getPartyColor } from '../../lib/utils';
import { VereadoresCollection } from '../vereadores';
import { ProjetosDeLeiCollection, ProjetosDeLeiStatus } from './collection';

async function aprovados({ mandato, onlyApproved }) {
  check(mandato, String);
  check(onlyApproved, Boolean);

  const startYear = mandato.split(';')[0];
  const endYear = mandato.split(';')[1];

  const projetosDeLei = await ProjetosDeLeiCollection.find(
    {
      $and: [
        { author: { $regex: 'Ver\\.\\(a\\)', $options: 'i' } },
        { author: { $not: /;/ } },
        { year: { $gte: startYear, $lte: endYear } },
        ...(onlyApproved ? [{ status: ProjetosDeLeiStatus.LEI }] : []),
      ],
    },
    { fields: { author: 1 } }
  ).fetchAsync();

  const groupedByAuthor = projetosDeLei.reduce((acc, projeto) => {
    const { author } = projeto;

    if (!acc[author]) {
      acc[author] = { author, value: 0 };
    }

    acc[author].value += 1;

    return acc;
  }, {});

  const authors = Object.values(groupedByAuthor)
    .map((item) => ({
      ...item,
      // removendo prefixo vereador
      author: item.author.replace(/^Ver\.\(a\)/, '').trim(),
    }))
    .sort((a, b) => b.value - a.value);

  const returnObject = [];
  for await (const author of authors) {
    const { author: authorName } = author;
    const vereador = await VereadoresCollection.findOneAsync(
      {
        $or: [
          { name: { $regex: authorName, $options: 'i' } },
          { fullName: { $regex: authorName, $options: 'i' } },
        ],
      },
      { fields: { party: 1 } }
    );

    if (vereador?.party) {
      author.party = vereador.party;
    }

    returnObject.push(author);
  }

  return authors;
}

async function partidos({ onlyApproved }) {
  check(onlyApproved, Boolean);

  const startYear = '2025';
  const endYear = '2028';

  const projetosDeLei = await ProjetosDeLeiCollection.find(
    {
      $and: [
        { author: { $regex: 'Ver\\.\\(a\\)', $options: 'i' } },
        { author: { $not: /;/ } },
        { year: { $gte: startYear, $lte: endYear } },
        ...(onlyApproved ? [{ status: ProjetosDeLeiStatus.LEI }] : []),
      ],
    },
    { fields: { author: 1 } }
  ).fetchAsync();

  const groupedByParty = {};

  for await (const projeto of projetosDeLei) {
    const authorName = projeto.author.replace(/^Ver\.\(a\)/, '').trim();
    const vereador = await VereadoresCollection.findOneAsync(
      {
        $or: [
          { name: { $regex: authorName, $options: 'i' } },
          { fullName: { $regex: authorName, $options: 'i' } },
        ],
      },
      { fields: { party: 1 } }
    );

    const party = vereador?.party || 'Desconhecido';
    const shortParty = party.slice(0, 5);

    if (!groupedByParty[party]) {
      groupedByParty[party] = {
        party: shortParty,
        fullParty: party,
        value: 0,
        fill: getPartyColor(party),
      };
    }

    groupedByParty[party].value += 1;
  }

  return Object.values(groupedByParty).sort((a, b) => b.value - a.value);
}

Meteor.methods({
  'ProjetosDeLei.aprovados': aprovados,
  'ProjetosDeLei.partidos': partidos,
});
