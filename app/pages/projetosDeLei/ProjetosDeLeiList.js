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
      <div className="col-span-5 mt-4 text-center md:col-span-3 md:mt-0 md:text-left">
        <p className="font-bold">{chartTitle}</p>
        <span className="sr-only">{chartTitle}.</span>
      </div>
      <div className="hidden items-center md:col-span-2 md:block" />

      {data.map((item) => (
        <div
          key={item.author}
          aria-hidden="true"
          className="col-span-5 my-1 grid grid-cols-6 items-center gap-4 md:col-span-7 md:grid-cols-10"
        >
          <button
            onClick={(e) =>
              onClickVereador(e, item.authorId?._str || item.authorId)
            }
            aria-hidden="true"
            className="col-span-3 flex items-center gap-3 text-left hover:text-blue-600 hover:underline md:col-span-2"
          >
            <Avatar>
              <AvatarImage src={item.imageUrl} alt={item.author} />
            </Avatar>
            {item.author}
          </button>

          <div className="relative col-span-2 md:col-span-7">
            <Progress
              barColor={getPartyColor(item.party)}
              className="w-full"
              value={item.value}
              max={max}
              role="progressbar"
              aria-hidden="true"
            />
            <span className="sr-only">
              {item.author} {item.value}.
            </span>
          </div>

          <p className="no-tts col-span-1 ml-1">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
