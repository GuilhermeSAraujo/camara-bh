import { FileCheck, Filter } from 'lucide-react';
import { default as React, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';
import { withTextToSpeech } from '../../components/TextToSpeech';
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
          <span className="sr-only">
            Página de visualização de dados sobre Projetos de Lei por partido
            político.
          </span>
        </header>

        {/* Seção de filtros */}
        <section aria-label="Filtros">
          <span className="sr-only">
            Área de filtros para personalizar a visualização dos dados.
          </span>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-1 md:gap-6">
            <div className="flex items-center">
              <Filter size="20px" className="no-tts" aria-hidden="true" />
              <Label
                className="text-md px-3"
                id="mandato-label"
                htmlFor="mandato-select"
              >
                Selecione o mandato
              </Label>
              <Select
                value={mandato}
                onValueChange={handleChangeMandato}
                aria-labelledby="mandato-label"
                id="mandato-select"
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione o mandato desejado" />
                </SelectTrigger>
                <SelectContent className="no-tts">
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
              <span className="sr-only">
                Mandato selecionado: {mandato.split(';')[0]} até{' '}
                {mandato.split(';')[1]}
              </span>
            </div>

            <div className="flex items-center">
              <FileCheck size="20px" className="no-tts" aria-hidden="true" />
              <Label htmlFor="onlyApprovedSwitch" className="text-md px-3">
                Apenas <span className="font-semibold">Aprovados</span>
              </Label>
              <Switch
                id="onlyApprovedSwitch"
                checked={onlyApproved}
                onCheckedChange={() => setOnlyApproved((v) => !v)}
                aria-checked={onlyApproved}
              />
              <span className="sr-only">
                {onlyApproved
                  ? 'Filtro ativado: exibindo apenas projetos aprovados'
                  : 'Exibindo todos os projetos: propostos e aprovados'}
              </span>
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
        </section>

        {/* Área do gráfico e resultados */}
        <section aria-label="Gráfico de projetos por partido">
          {isLoading ? (
            <div>
              <Spinner className="no-tts mt-12" size="large" />
              <span className="sr-only">
                Carregando dados dos projetos de lei por partido
              </span>
            </div>
          ) : data?.length > 0 ? (
            <div>
              <div className="no-tts mt-4 text-center font-bold">
                Foram analisados {projetosDeLeiQuantity} Projetos de Lei de{' '}
                {data?.length} partidos.
              </div>

              <span className="sr-only">
                Resultado da consulta: Foram analisados {projetosDeLeiQuantity}{' '}
                Projetos de Lei de {data?.length} partidos no período de{' '}
                {mandato.split(';')[0]} até {mandato.split(';')[1]}.
                {onlyApproved
                  ? ' Mostrando apenas projetos aprovados.'
                  : ' Mostrando todos os projetos propostos.'}
              </span>

              {/* Descrição detalhada para leitores de tela */}
              <div className="sr-only">
                <h3>Detalhamento dos dados por partido:</h3>
                <ul>
                  {data.map((item, index) => (
                    <li key={index}>
                      Partido {item.party}: {item.value} projetos de lei{' '}
                      {onlyApproved ? 'aprovados' : 'propostos'}.
                    </li>
                  ))}
                </ul>
                <p>
                  Para navegar aos vereadores de um partido específico,
                  selecione o nome do partido no gráfico.
                </p>
              </div>

              <div className="no-tts mt-10 gap-4 overflow-x-auto">
                <div className="min-w-[300px]">
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
                  <span className="sr-only">
                    Gráfico de barras mostrando a quantidade de projetos de lei
                    por partidos.
                    {data?.map((item) => ` ${item.party}: ${item.value}.`)}.
                  </span>
                </div>
              </div>

              <div className="no-tts mt-2 text-center">
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
              <span className="sr-only">
                Não foram encontrados projetos de lei para os filtros
                selecionados. Período: {mandato.split(';')[0]} até{' '}
                {mandato.split(';')[1]}.
                {onlyApproved ? ' Com filtro de apenas aprovados ativado.' : ''}
              </span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default withTextToSpeech(ProjetosDeLeiPartidos);
