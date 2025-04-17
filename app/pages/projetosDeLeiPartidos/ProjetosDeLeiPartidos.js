import { FileCheck, Filter } from 'lucide-react';
import { default as React, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../../components/ui/Chart';
import ChartDetailsModal from '../../components/ui/ChartDetailsModal';
import { Label } from '../../components/ui/Label';
import { ReturnButton } from '../../components/ui/ReturnButton';
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
import { withTextToSpeech } from '../../components/TextToSpeech';

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

function ProjetosDeLeiPartidos() {
  const navigate = useNavigate();
  const [onlyApproved, setOnlyApproved] = useState(false);
  const [mandato, setMandato] = useState('2021;2024');

  const [data, { isLoading }] = useMethodWithState({
    method: 'ProjetosDeLei.partidos',
    params: { mandato, onlyApproved },
    dependencyArray: [mandato, onlyApproved],
  });

  function handleChangeMandato(value) {
    if (value === mandato) return;
    setMandato(value);
  }

  const handlePartyClick = (party) => {
    navigate('/vereadores', { state: { selectedParty: party } });
  };

  const projetosDeLeiQuantity = data?.reduce((acc, item) => {
    acc += item.value;
    return acc;
  }, 0);

  return (
    <div>
      <div className="m-4">
        <ReturnButton />
      </div>
      <div className="container mx-auto max-w-sm p-4 md:max-w-7xl">
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

        <div>
          {isLoading ? (
            <Spinner className="mt-12" size="large" />
          ) : data?.length > 0 ? (
            <div>
              <div className="mt-4 text-center font-bold">
                Foram analisados {projetosDeLeiQuantity} Projetos de Lei de{' '}
                {data?.length} partidos.
              </div>
              <div className="mt-10 gap-4 overflow-x-auto">
                <div className="min-w-[800px]">
                  <ChartContainer config={chartConfig} className="w-full">
                    <BarChart
                      accessibilityLayer
                      data={data}
                      margin={{ bottom: 60 }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="party"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        height={60}
                        interval={0}
                        tick={(props) => {
                          const { x, y, payload } = props;
                          return (
                            <g transform={`translate(${x},${y})`}>
                              <text
                                x={0}
                                y={0}
                                dy={5}
                                textAnchor="end"
                                fill="#2563eb"
                                className="cursor-pointer text-sm transition-all hover:fill-blue-800 hover:underline"
                                transform="rotate(-45)"
                                onClick={() => handlePartyClick(payload.value)}
                                title={`Clique para ver vereadores do ${payload.value}`}
                              >
                                {payload.value}
                              </text>
                            </g>
                          );
                        }}
                      />
                      <YAxis
                        type="number"
                        domain={[0, 'dataMax + 1']}
                        tickLine={false}
                        allowDecimals={false}
                        axisLine={false}
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
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-600">
                  Projetos de Lei {onlyApproved ? 'Aprovados' : 'Propostos'}{' '}
                  entre {mandato.split(';')[0]} - {mandato.split(';')[1]}
                </p>
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
    </div>
  );
}

export default withTextToSpeech(ProjetosDeLeiPartidos);
