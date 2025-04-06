import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { getPartyColor } from '../../lib/utils';
import { VereadoresCollection } from '../vereadores';
import { ProjetosDeLeiCollection, ProjetosDeLeiStatus } from './collection';

const VEREADORES_CACHE = new Map();

async function aprovados({ mandato, onlyApproved }) {
  check(mandato, String);
  check(onlyApproved, Boolean);

  const startYear = parseInt(mandato.split(';')[0], 10);
  const endYear = parseInt(mandato.split(';')[1], 10);

  const projetosDeLei = await ProjetosDeLeiCollection.find(
    {
      $and: [
        { author: { $not: /;/ } },
        {
          year: { $gte: startYear, $lte: endYear },
        },
        ...(onlyApproved ? [{ status: ProjetosDeLeiStatus.LEI }] : []),
      ],
    },
    { fields: { author: 1, authorId: 1 } }
  ).fetchAsync();

  const groupedByAuthor = projetosDeLei.reduce((acc, projeto) => {
    const { authorId, author } = projeto;

    if (!acc[authorId]) {
      acc[authorId] = {
        author: author.replace('Ver.(a) ', ''),
        authorId,
        value: 0,
      };
    }

    acc[authorId].value += 1;

    return acc;
  }, {});

  const authors = Object.values(groupedByAuthor).sort(
    (a, b) => b.value - a.value
  );

  const returnObject = [];

  for await (const author of authors) {
    let vereador = VEREADORES_CACHE.get(author.author);

    if (!vereador) {
      vereador = await VereadoresCollection.findOneAsync(
        {
          _id: author.authorId,
        },
        {
          fields: {
            mandates: 1,
          },
        }
      );

      VEREADORES_CACHE.set(author.author, vereador);
    }

    const vereadorParty =
      vereador?.mandates.find(
        (m) => m.startYear >= startYear && m.endYear <= endYear
      )?.party || 'Desconhecido';

    returnObject.push({ ...author, party: vereadorParty });
  }

  return returnObject;
}

async function partidos({ onlyApproved }) {
  check(onlyApproved, Boolean);

  const startYear = '2021';
  const endYear = '2024';

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
