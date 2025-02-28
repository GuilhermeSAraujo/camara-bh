import { FileCheck, Filter } from 'lucide-react';
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
import { Spinner } from '../../components/ui/Spinner';
import { Switch } from '../../components/ui/Switch';
import { useMethodWithState } from '../../hooks/useMethodWithState';
import { PARTY_COLOR } from '../../lib/consts';
import { ChartDetailsModal } from './ChartDetailsModal';

const filterOptions = ['2013;2016', '2017;2020', '2021;2024', '2025;2028'];

export function ProjetosDeLei() {
  const [mandato, setMandato] = useState('2025;2028');
  const [onlyApproved, setOnlyApproved] = useState(true);

  const [data, { isLoading }] = useMethodWithState({
    method: 'ProjetosDeLei.aprovados',
    params: { mandato, onlyApproved },
    dependencyArray: [mandato, onlyApproved],
  });

  function handleChangeMandato(value) {
    if (value === mandato) return;

    setMandato(value);
  }

  function getPartyColor(party) {
    if (party) {
      return PARTY_COLOR[party];
    }
    return '#808080';
  }

  return (
    <div className="container mx-auto p-4 md:max-w-7xl">
      <div className="self-center">
        <h2 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl">
          <span className="underline">Projetos de Lei</span> propostos e
          aprovados por <span className="underline">Vereador</span>
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-1 md:gap-6">
        <div className="flex items-center">
          <Filter size="20px" />
          <Label className="text-md px-3">Selecione o mandato</Label>
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
        <div className="flex justify-start">
          <ChartDetailsModal />
        </div>
      </div>

      {isLoading ? (
        <Spinner className="mt-12" size="large" />
      ) : (
        <div className="mt-10 grid grid-cols-5 gap-4 md:grid-cols-7">
          {data &&
            data.map((item) => (
              <React.Fragment key={item.author}>
                <h3 className="col-span-2 items-center md:col-span-1">
                  {item.author}
                </h3>
                <Progress
                  barColor={getPartyColor(item.party)}
                  className="col-span-2 md:col-span-5"
                  value={item.value}
                  max={data[0]?.value}
                />
                <h3 className="col-span-1">{item.value}</h3>
              </React.Fragment>
            ))}
        </div>
      )}
    </div>
  );
}
