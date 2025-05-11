import React, { memo, useMemo } from 'react';
import { Avatar, AvatarImage } from '../../components/ui/Avatar';
import { Progress } from '../../components/ui/Progress';
import { getPartyColor } from '../../lib/utils';

// Memoized item component to prevent unnecessary re-renders
const ListItem = memo(({ item, max, onClickVereador }) => {
  // Pre-compute the handler to avoid recreating on each render
  const handleClick = (e) => {
    onClickVereador(e, item.authorId?._str || item.authorId);
  };

  return (
    <div className="col-span-5 my-1 grid grid-cols-6 items-center gap-4 md:col-span-7 md:grid-cols-10">
      <button
        onClick={handleClick}
        className="col-span-3 flex items-center gap-3 text-left hover:text-blue-600 hover:underline md:col-span-2"
        aria-label={`Ver detalhes de ${item.author}, ${item.value} projetos`}
      >
        <Avatar>
          <AvatarImage
            src={item.imageUrl}
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
        </Avatar>
        <span className="line-clamp-1">{item.author}</span>
      </button>

      <div className="relative col-span-2 md:col-span-7">
        <Progress
          barColor={getPartyColor(item.party)}
          className="w-full"
          value={item.value}
          max={max}
          aria-valuemin="0"
          aria-valuemax={max}
          aria-valuenow={item.value}
          aria-label={`${item.value} de ${max} projetos`}
        />
      </div>

      <p className="col-span-1 ml-1 font-medium">{item.value}</p>
    </div>
  );
});

ListItem.displayName = 'ListItem';

// Header component extracted for clarity
const ListHeader = memo(({ chartTitle }) => (
  <>
    <div className="hidden md:col-span-2 md:block" />
    <div className="col-span-5 mt-4 text-center md:col-span-3 md:mt-0 md:text-left">
      <h3 className="font-bold">{chartTitle}</h3>
    </div>
    <div className="hidden items-center md:col-span-2 md:block" />
  </>
));

ListHeader.displayName = 'ListHeader';

function ProjetosDeLeiList({ data, mandato, onlyApproved, onClickVereador }) {
  // Memoize calculations to prevent recalculation on re-renders
  const { total, max, chartTitle } = useMemo(() => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    const [yearStart, yearEnd] = mandato.split(';');
    const max = data[0]?.value || 0;

    const title = onlyApproved
      ? `Projetos de Lei Aprovados entre ${yearStart} - ${yearEnd}: ${total}`
      : `Projetos de Lei Propostos entre ${yearStart} - ${yearEnd}: ${total}`;

    return { total, max, chartTitle: title };
  }, [data, mandato, onlyApproved]);

  // Don't render if there's no data
  if (!data.length) {
    return null;
  }

  return (
    <section
      className="mt-10 grid grid-cols-5 gap-4 md:grid-cols-7"
      aria-labelledby="projetos-lei-title"
    >
      <h2 id="projetos-lei-title" className="sr-only">
        {chartTitle} - Lista de Vereadores
      </h2>

      <ListHeader chartTitle={chartTitle} />

      {data.map((item) => (
        <ListItem
          key={item.author}
          item={item}
          max={max}
          onClickVereador={onClickVereador}
        />
      ))}
    </section>
  );
}

// Export a memoized version of the component
export default memo(ProjetosDeLeiList);
