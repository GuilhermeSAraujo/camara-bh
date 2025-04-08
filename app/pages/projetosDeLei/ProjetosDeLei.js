import { FileCheck, Filter } from 'lucide-react';
import React, { useState } from 'react';
import { ChartDetailsModal } from '../../components/ui/ChartDetailsModal';
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
import { getPartyColor } from '../../lib/utils';

const filterOptions = ['2013;2016', '2017;2020', '2021;2024'];

export default function ProjetosDeLei() {
  const [mandato, setMandato] = useState('2021;2024');
  const [onlyApproved, setOnlyApproved] = useState(false);

  const [data, { isLoading }] = useMethodWithState({
    method: 'ProjetosDeLei.aprovados',
    params: { mandato, onlyApproved },
    dependencyArray: [mandato, onlyApproved],
  });

  function handleChangeMandato(value) {
    if (value === mandato) return;

    setMandato(value);
  }

  function getTotalLaws() {
    if (!data?.length) return 0;

    return data.reduce((acc, item) => acc + item.value, 0);
  }

  function getChartTitle() {
    const total = getTotalLaws();
    if (onlyApproved) {
      return `Projetos de Lei Aprovados entre ${mandato.split(';')[0]} - ${mandato.split(';')[1]}: ${total}`;
    }
    return `Projetos de Lei Propostos entre ${mandato.split(';')[0]} - ${mandato.split(';')[1]}: ${total}`;
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
        <div className="flex items-center">
          <FileCheck size="20px" />
          <Label id="onlyApproved" className="text-md px-3">
            Apenas <span className="font-semibold">Aprovados</span>
          </Label>
          <Switch
            checked={onlyApproved}
            onCheckedChange={() => setOnlyApproved((v) => !v)}
            htmlFor="onlyApproved"
          />
        </div>
        <div className="flex justify-start">
          <ChartDetailsModal />
        </div>
      </div>

      {isLoading ? (
        <Spinner className="mt-12" size="large" />
      ) : data?.length > 0 ? (
        <div className="mt-10 grid grid-cols-5 gap-4 md:grid-cols-7">
          <div className="hidden md:col-span-2 md:block" />
          <div className="col-span-5 mt-4 text-center font-bold md:col-span-3 md:mt-0 md:text-left">
            {getChartTitle()}
          </div>
          <div className="hidden md:col-span-2 md:block" />
          {data.map((item) => (
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
      ) : (
        <div className="mt-12 text-center">
          <h3 className="text-lg">
            Nenhum projeto foi aprovado até o momento!
          </h3>
        </div>
      )}
    </div>
  );
}
