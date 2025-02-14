import React from 'react';
import { Progress } from '../../components/ui/Progress';
import { useMethodWithState } from '../../hooks/useMethodWithState';

export function ProjetosDeLei() {
  const [data] = useMethodWithState({ method: 'ProjetosDeLei.aprovados' });

  return (
    <div className='md:max-w-7xl" container mx-auto p-4'>
      <div className="self-center">
        <h2 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl">
          Projetos de Lei aprovados por Vereador
        </h2>
      </div>
      <div className="mt-8 grid grid-cols-5 gap-4 md:grid-cols-7">
        {data &&
          data.map((item) => (
            <React.Fragment key={item.author}>
              <h3 className="col-span-2 items-center md:col-span-1">
                {item.author}
              </h3>
              <Progress
                className="col-span-2 md:col-span-5"
                value={item.value}
                max={data[0]?.value}
              />
              <h3 className="col-span-1">{item.value}</h3>
            </React.Fragment>
          ))}
      </div>
    </div>
  );
}
