import React from 'react';
import { Avatar, AvatarImage } from '../../components/ui/Avatar';
import { Progress } from '../../components/ui/Progress';
import { getPartyColor } from '../../lib/utils';

export default function ProjetosDeLeiList({
  data,
  mandato,
  onlyApproved,
  onClickVereador,
}) {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const [yearStart, yearEnd] = mandato.split(';');

  const chartTitle = onlyApproved
    ? `Projetos de Lei Aprovados entre ${yearStart} - ${yearEnd}: ${total}`
    : `Projetos de Lei Propostos entre ${yearStart} - ${yearEnd}: ${total}`;

  const max = data[0]?.value || 0;

  return (
    <div className="mt-10 grid grid-cols-5 gap-4 md:grid-cols-7">
      <div className="hidden md:col-span-2 md:block" />
      <div className="col-span-5 mt-4 text-center font-bold md:col-span-3 md:mt-0 md:text-left">
        {chartTitle}
      </div>
      <div className="hidden items-center md:col-span-2 md:block" />

      {data.map((item) => (
        <div
          key={item.author}
          className="col-span-5 my-1 grid grid-cols-6 items-center gap-4 md:col-span-7 md:grid-cols-10"
        >
          <button
            onClick={(e) =>
              onClickVereador(e, item.authorId?._str || item.authorId)
            }
            className="col-span-3 flex items-center gap-3 text-left hover:text-blue-600 hover:underline md:col-span-2"
          >
            <Avatar>
              <AvatarImage src={item.imageUrl} alt={item.author} />
            </Avatar>
            {item.author}
          </button>

          <Progress
            barColor={getPartyColor(item.party)}
            className="col-span-2 md:col-span-7"
            value={item.value}
            max={max}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={item.value}
            aria-label={`Projetos aprovados por ${item.author}`}
          />

          <p
            className="col-span-1"
            aria-valuetext={`Vereador ${item.author} tem ${item.value} projetos aprovados`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
