import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { ProjetosDeLeiCollection, ProjetosDeLeiStatus } from './collection';

async function aprovados({ startYear, endYear }) {
  check(startYear, Number);
  check(endYear, Number);

  const projetosDeLei = await ProjetosDeLeiCollection.find(
    {
      $and: [
        { author: { $regex: 'Ver\\.\\(a\\)', $options: 'i' } },
        { author: { $not: /;/ } },
        { year: { $gte: startYear.toString(), $lte: endYear.toString() } },
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

async function filterOptions() {
  const projetosDeLeiCursor = await ProjetosDeLeiCollection.find(
    {},
    { fields: { year: 1 } }
  ).fetchAsync();

  const yearsSet = new Set();

  for await (const projetoDeLei of projetosDeLeiCursor) {
    yearsSet.add(projetoDeLei.year);
  }

  return Array.from(yearsSet).sort();
}

Meteor.methods({
  'ProjetosDeLei.aprovados': aprovados,
  'ProjetosDeLei.filterOptions': filterOptions,
});
