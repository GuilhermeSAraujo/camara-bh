import { FileCheck, Filter } from 'lucide-react';
import { default as React, Suspense, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../../components/ui/Chart';
import ChartDetailsModal from '../../components/ui/ChartDetailsModal';
import { Label } from '../../components/ui/Label';
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

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#2563eb',
  },
  mobile: {
    label: 'Mobile',
    color: '#60a5fa',
  },
};

export default function ProjetosDeLeiPartidos() {
  const [onlyApproved, setOnlyApproved] = useState(false);

  const [mandato, setMandato] = useState('2021;2024');

  function handleChangeMandato(value) {
    if (value === mandato) return;
    setMandato(value);
  }

  const [data, { isLoading }] = useMethodWithState({
    method: 'ProjetosDeLei.partidos',
    params: { mandato, onlyApproved },
    dependencyArray: [mandato, onlyApproved],
  });

  console.log('data!!', data, { isLoading });
  return (
    <div>
      <div className="container mx-0 max-w-xs p-4 md:mx-auto md:max-w-7xl">
        <header className="self-center">
          <h2 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl">
            <span className="underline">Projetos de Lei</span> propostos e
            aprovados por <span className="underline">Partido</span>
          </h2>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-1 md:gap-6">
          <div className="flex items-center">
            <Filter size="20px" aria-hidden="true" />
            <Label className="text-md px-3">Selecione o mandato</Label>
            <Select
              value={mandato}
              onValueChange={handleChangeMandato}
              aria-label="Selecione o mandato"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o mandato desejado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Mandatos</SelectLabel>
                  {filterOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year.replace(';', ' - ')}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center">
            <FileCheck size="20px" aria-hidden="true" />
            <Label htmlFor="onlyApprovedSwitch" className="text-md px-3">
              Apenas <span className="font-semibold">Aprovados</span>
            </Label>
            <Switch
              id="onlyApprovedSwitch"
              checked={onlyApproved}
              onCheckedChange={() => setOnlyApproved((v) => !v)}
            />
          </div>
          <div className="flex justify-start">
            <Suspense
              fallback={
                <Spinner
                  className="mt-12"
                  size="large"
                  role="status"
                  aria-live="polite"
                />
              }
            >
              <ChartDetailsModal />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="container mx-auto max-w-full p-4 md:max-w-7xl">
        {isLoading ? (
          <Spinner className="mt-12" size="large" />
        ) : data?.length > 0 ? (
          <div className="mt-10 gap-4 overflow-x-auto">
            <div className="min-w-[800px]">
              <ChartContainer config={chartConfig} className="w-full">
                <BarChart accessibilityLayer data={data}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="party"
                    tickLine={false}
                    tickMargin={1}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 5)}
                  />
                  <YAxis
                    tickCount={25}
                    label={{
                      value: 'Quantidade',
                      angle: -90,
                      position: 'insideLeft',
                    }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={4}>
                    {data.map((entry) => (
                      <Cell
                        key={entry.party}
                        fill={getPartyColor(entry.party)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        ) : (
          <div className="mt-12 text-center">
            <h3 className="text-lg">
              Nenhum projeto foi aprovado até o momento!
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
