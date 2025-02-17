import React, { useState } from 'react';
import { Progress } from '../../components/ui/Progress';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/Select';
import { useMethodWithState } from '../../hooks/useMethodWithState';

export function ProjetosDeLei() {
  const [startYear, setStartYear] = useState(2019);
  const [endYear, setEndYear] = useState(2024);

  const [filterOptions] = useMethodWithState({
    method: 'ProjetosDeLei.filterOptions',
  });
  console.log({ filterOptions });

  const [data] = useMethodWithState({
    method: 'ProjetosDeLei.aprovados',
    params: { startYear, endYear },
  });

  return (
    <div className='md:max-w-7xl" container mx-auto p-4'>
      <div className="self-center">
        <h2 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl">
          Projetos de Lei aprovados por Vereador
        </h2>
      </div>

      <div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o ano de início" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Anos</SelectLabel>
              {filterOptions &&
                filterOptions.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-12 grid grid-cols-5 gap-4 md:grid-cols-7">
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
