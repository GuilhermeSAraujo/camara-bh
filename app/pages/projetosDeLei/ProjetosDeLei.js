import React, { useState } from 'react';
import { Label } from '../../components/ui/Label';
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

const filterOptions = ['2013;2016', '2017;2020', '2021;2024'];

export function ProjetosDeLei() {
  const [mandato, setMandato] = useState('2021;2024');

  const [data] = useMethodWithState({
    method: 'ProjetosDeLei.aprovados',
    params: { mandato },
    dependencyArray: [mandato],
  });

  function handleChangeMandato(value) {
    if (value === mandato) return;

    setMandato(value);
  }

  return (
    <div className='md:max-w-7xl" container mx-auto p-4'>
      <div className="self-center">
        <h2 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl">
          Projetos de Lei aprovados por Vereador
        </h2>
      </div>

      <div className="mt-10 flex items-center">
        <Label className="text-md pr-4">Selecione o mandato</Label>
        <Select value={mandato} onValueChange={handleChangeMandato}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o mandato desejado" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Mandatos</SelectLabel>
              {filterOptions &&
                filterOptions.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year.replace(';', ' - ')}
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
