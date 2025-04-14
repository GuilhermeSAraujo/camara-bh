import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { VereadoresCollection } from '../vereadores';
import { ProjetosDeLeiCollection, ProjetosDeLeiStatus } from './collection';

const VEREADORES_CACHE = new Map();
const PARTIES_CACHE = new Map();

async function aprovados({ mandato, onlyApproved }) {
  check(mandato, String);
  check(onlyApproved, Boolean);

  const startYear = parseInt(mandato.split(';')[0], 10);
  const endYear = parseInt(mandato.split(';')[1], 10);

  const projetosDeLei = await ProjetosDeLeiCollection.find(
    {
      $and: [
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

    if (vereadorParty === 'Desconhecido') {
      console.warn(
        new Date().toLocaleString('pt-BR'),
        `Vereador ${author.author} não possui partido definido para o mandato ${startYear} - ${endYear}`,
        vereador,
        { authorId: author.authorId }
      );
    }

    returnObject.push({ ...author, party: vereadorParty });
  }

  console.info(
    new Date().toLocaleString('pt-BR'),
    `VEREADORES_CACHE Size: ${VEREADORES_CACHE.size}`
  );

  return returnObject;
}

async function partidos({ mandato, onlyApproved }) {
  check(mandato, String);
  check(onlyApproved, Boolean);

  const startYear = parseInt(mandato.split(';')[0], 10);
  const endYear = parseInt(mandato.split(';')[1], 10);

  const projetosDeLei = ProjetosDeLeiCollection.find(
    {
      $and: [
        {
          year: { $gte: startYear, $lte: endYear },
        },
        ...(onlyApproved ? [{ status: ProjetosDeLeiStatus.LEI }] : []),
      ],
    },
    { fields: { author: 1, authorId: 1 } }
  );

  const groupedByParty = {};

  for await (const projetoDeLei of projetosDeLei) {
    const authorIdKey =
      projetoDeLei.authorId &&
      typeof projetoDeLei.authorId.toHexString === 'function'
        ? projetoDeLei.authorId.toHexString()
        : projetoDeLei.authorId.toString();

    if (PARTIES_CACHE.has(authorIdKey)) {
      const vereador = PARTIES_CACHE.get(authorIdKey);

      const vereadorParty = vereador.mandates.find(
        (m) => m.startYear >= startYear && m.endYear <= endYear
      )?.party;

      if (vereadorParty) {
        if (!groupedByParty[vereadorParty]) {
          groupedByParty[vereadorParty] = {
            party: vereadorParty,
            value: 0,
          };
        }

        groupedByParty[vereadorParty].value += 1;
      }
      continue;
    }

    const vereador = await VereadoresCollection.findOneAsync(
      {
        _id: projetoDeLei.authorId,
      },
      {
        fields: {
          mandates: 1,
        },
      }
    );

    if (!vereador) {
      continue;
    }

    PARTIES_CACHE.set(authorIdKey, vereador);

    const vereadorParty = vereador.mandates.find(
      (m) => m.startYear >= startYear && m.endYear <= endYear
    )?.party;

    if (vereadorParty) {
      if (!groupedByParty[vereadorParty]) {
        groupedByParty[vereadorParty] = {
          party: vereadorParty,
          value: 0,
        };
      }

      groupedByParty[vereadorParty].value += 1;
    }
  }

  const parties = Object.values(groupedByParty).sort(
    (a, b) => b.value - a.value
  );

  console.info(
    new Date().toLocaleString('pt-BR'),
    `PARTIES_CACHE Size: ${PARTIES_CACHE.size}`
  );

  return parties;
}

async function search({ textSearch }) {
  check(textSearch, String);

  if (textSearch.trim() === '') {
    return [];
  }

  const regex = new RegExp(textSearch, 'i');

  const projetosDeLei = await ProjetosDeLeiCollection.find({
    $or: [
      { title: { $regex: regex } },
      { author: { $regex: regex } },
      { summary: { $regex: regex } },
      { subject: { $regex: regex } },
    ],
  }).fetchAsync();

  projetosDeLei.sort((a, b) => b.title.localeCompare(a.title));

  return projetosDeLei;
}

Meteor.methods({
  'ProjetosDeLei.aprovados': aprovados,
  'ProjetosDeLei.partidos': partidos,
  'ProjetosDeLei.search': search,
});
