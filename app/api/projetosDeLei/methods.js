import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { ProjetosDeLeiCollection, ProjetosDeLeiStatus } from './collection';

async function aprovados({ mandato }) {
  check(mandato, String);
  const startYear = mandato.split(';')[0];
  const endYear = mandato.split(';')[1];

  const projetosDeLei = await ProjetosDeLeiCollection.find(
    {
      $and: [
        { author: { $regex: 'Ver\\.\\(a\\)', $options: 'i' } },
        { author: { $not: /;/ } },
        { year: { $gte: startYear, $lte: endYear } },
        { status: ProjetosDeLeiStatus.LEI },
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

  return Object.values(groupedByAuthor)
    .map((item) => ({
      ...item,
      author: item.author.replace(/^Ver\.\(a\)/, '').trim(),
    }))
    .sort((a, b) => b.value - a.value);
}

Meteor.methods({
  'ProjetosDeLei.aprovados': aprovados,
});
