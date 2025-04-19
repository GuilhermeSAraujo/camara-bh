import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { withTextToSpeech } from '../../components/TextToSpeech';
import { ReturnButton } from '../../components/ui/ReturnButton';
import { Spinner } from '../../components/ui/Spinner';
import { useMethodWithState } from '../../hooks/useMethodWithState';
import { getStatusColor, getStatusColorHex } from '../../lib/utils';

const DEFAULT_AVATAR =
  'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

function VereadorDetalhes() {
  const { idVereador } = useParams();
  const [onlyApproved, setOnlyApproved] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const findFirstAvailableImage = (mandates) => {
    if (!mandates || !Array.isArray(mandates)) return DEFAULT_AVATAR;

    for (let i = mandates.length - 1; i >= 0; i--) {
      if (mandates[i]?.imgUrl) {
        return mandates[i].imgUrl;
      }
    }

    return DEFAULT_AVATAR;
  };

  const prepareChartData = (projetos) => {
    if (!projetos) return [];

    const statusCount = projetos.reduce((acc, projeto) => {
      acc[projeto.status] = (acc[projeto.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCount).map(([status, value]) => ({
      name: status,
      value,
    }));
  };

  const handlePieClick = (entry) => {
    if (entry && entry.name) {
      setSelectedStatus(selectedStatus === entry.name ? null : entry.name);
    }
  };

  const [vereador, { isLoading: isLoadingVereador }] = useMethodWithState({
    method: 'Vereadores.findById',
    params: { id: idVereador },
    dependencyArray: [idVereador],
    conditionToRun: !!idVereador,
  });

  const [data, { isLoading: isLoadingLeis }] = useMethodWithState({
    method: 'ProjetosDeLei.porVereador',
    params: {
      id: vereador?._id,
      onlyApproved,
    },
    dependencyArray: [onlyApproved],
    conditionToRun: !!vereador?._id,
  });

  const filteredProjetos = data?.projetosDeLei?.filter(
    (projeto) => !selectedStatus || projeto.status === selectedStatus
  );

  function handleClickProjeto(projeto) {
    const baseUrl =
      'https://www.cmbh.mg.gov.br/atividade-legislativa/pesquisar-proposicoes/projeto-de-lei';
    const number = projeto.title.split('- ')?.[1].split('/')?.[0].trim();
    const year = projeto.title.split('/')?.[1].trim();
    return `${baseUrl}/${number}/${year}`;
  }

  function handleOnlyApprovedFilter(filter) {
    if (filter === onlyApproved) {
      setOnlyApproved(false);
      return;
    }
    setOnlyApproved(filter);
  }

  if (!vereador && !isLoadingVereador) {
    return (
      <div>
        <div className="m-4">
          <ReturnButton />
        </div>
        <div className="flex h-screen items-center justify-center">
          <div className="rounded-lg bg-white p-8 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800">
              Vereador não encontrado
            </h2>
            <p className="mt-2 text-gray-600">
              Não foi possível encontrar o vereador solicitado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const lastMandate = vereador?.mandates?.[vereador.mandates.length - 1];
  const imageUrl = findFirstAvailableImage(vereador?.mandates);

  return (
    <div>
      <div className="m-4">
        <ReturnButton />
      </div>
      <div className="container mx-auto px-4 md:max-w-7xl">
        {isLoadingVereador ? (
          <Spinner
            className="mt-12"
            size="large"
            role="status"
            aria-live="polite"
          />
        ) : (
          <main className="flex-1 rounded-xl bg-gray-100">
            {/* Cabeçalho */}
            <span className="sr-only">
              Página de detalhes do vereador: {vereador.name}.
            </span>

            <div className="mb-6 mt-6 flex items-start p-4">
              {' '}
              <img
                src={imageUrl}
                alt={vereador.name}
                className="mr-6 h-40 w-32 rounded-xl object-cover shadow-md"
                onError={(e) => {
                  e.target.src = DEFAULT_AVATAR;
                }}
              />
              <div className="grid gap-2">
                <h1 className="text-3xl font-bold">{vereador.name}</h1>
                {vereador.name !== vereador.fullName && (
                  <>
                    <p className="text-gray-600">
                      Nome civil:{' '}
                      <span className="font-medium">{vereador.fullName}</span>
                    </p>
                    <span className="sr-only">
                      Nome civil: {vereador.fullName}.
                    </span>
                  </>
                )}
                <p className="text-gray-600">
                  Mandato mais recente:{' '}
                  <span className="font-semibold">
                    {lastMandate?.startYear} - {lastMandate?.endYear}
                  </span>
                  <span className="sr-only">
                    Mandato mais recente: {lastMandate?.startYear} -{' '}
                    {lastMandate?.endYear}.
                  </span>
                </p>
                <p className="text-gray-600">
                  Último partido:{' '}
                  <span className="font-semibold">{lastMandate?.party}</span>
                </p>
                <span className="sr-only">
                  Último partido: {lastMandate?.party}.
                </span>
              </div>
            </div>

            {/* Mandatos */}
            <div className="mb-6 rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-bold">Histórico de Mandatos</h2>
              <span className="sr-only">Histórico de mandatos:</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {vereador.mandates?.map((mandato) => (
                  <div
                    key={mandato.startYear}
                    className="rounded-lg border p-4 text-center"
                  >
                    <p className="font-semibold">
                      {mandato.startYear} - {mandato.endYear}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {mandato.party}
                    </p>
                    <span className="sr-only">
                      De {mandato.startYear} a {mandato.endYear} partido:
                      {mandato.party}.
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gráfico de Status */}
            <div className="mb-6 rounded-lg bg-white p-6 shadow">
              {isLoadingLeis ? (
                <Spinner
                  className="mt-12"
                  size="large"
                  role="status"
                  aria-live="polite"
                />
              ) : (
                data?.projetosDeLei?.length > 0 && (
                  <>
                    <h2 className="mb-4 text-xl font-bold">
                      Distribuição dos Projetos por Status
                      {selectedStatus ? (
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          (Filtrado por:{' '}
                          <span className="font-bold">{selectedStatus}</span>)
                          <button
                            onClick={() => setSelectedStatus(null)}
                            className="ml-2 text-blue-600 hover:underline"
                          >
                            Limpar filtro
                          </button>
                        </span>
                      ) : (
                        <span className="ml-2 text-sm font-normal text-gray-500 underline">
                          Clique no Gráfico para Filtrar
                          <span className="sr-only">
                            Você pode clicar no gráfico para filtrar projetos
                            por status.
                          </span>
                        </span>
                      )}
                    </h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div
                        className="mt-4 h-[315px] self-center focus:outline-none"
                        tabIndex={-1}
                        aria-label="Gráfico de pizza mostrando a distribuição de projetos por status"
                      >
                        <span className="sr-only">
                          Este gráfico mostra a distribuição dos projetos de lei
                          por status. Você pode interagir com o gráfico para
                          filtrar os resultados.
                        </span>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart style={{ outline: 'none' }}>
                            <Pie
                              data={prepareChartData(data.projetosDeLei)}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              className="focus:outline-none"
                              isAnimationActive
                              animationBegin={0}
                              animationDuration={1000}
                              onClick={handlePieClick}
                              cursor="pointer"
                            >
                              {prepareChartData(data.projetosDeLei).map(
                                (entry) => (
                                  <Cell
                                    key={`cell-${entry.name}`}
                                    fill={getStatusColorHex(entry.name)}
                                    opacity={
                                      selectedStatus &&
                                      selectedStatus !== entry.name
                                        ? 0.3
                                        : 1
                                    }
                                    className="transition-opacity hover:opacity-80 focus:outline-none"
                                  />
                                )
                              )}
                            </Pie>
                            <Tooltip
                              formatter={(value, name) => [
                                `${value} projetos`,
                                name,
                              ]}
                              contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: 'none',
                                borderRadius: '0.5rem',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                padding: '0.5rem 1rem',
                              }}
                            />
                            <Legend
                              verticalAlign="bottom"
                              align="center"
                              layout="horizontal"
                              wrapperStyle={{
                                paddingTop: '20px',
                              }}
                              onClick={handlePieClick}
                              cursor="pointer"
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex flex-col justify-center space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {prepareChartData(data.projetosDeLei).map(
                            (status) => (
                              <div
                                key={status.name}
                                className="rounded-lg border p-4 transition-colors hover:bg-gray-50"
                                style={{
                                  borderLeftColor: getStatusColorHex(
                                    status.name
                                  ),
                                  borderLeftWidth: '4px',
                                }}
                              >
                                <p className="text-sm text-gray-600">
                                  {status.name}
                                </p>
                                <p className="text-2xl font-bold">
                                  {status.value}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {(
                                    (status.value / data.projetosDeLei.length) *
                                    100
                                  ).toFixed(1)}
                                  %
                                  <span className="sr-only">
                                    {status.value} projetos de lei com status{' '}
                                    {status.name}.
                                  </span>
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )
              )}
            </div>

            {/* Projetos de Lei */}
            <div className="rounded-lg bg-white p-6 shadow">
              {!isLoadingLeis ? (
                <div>
                  <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-3 w-full text-left md:mb-0 md:w-auto">
                      <h2 className="text-xl font-bold">
                        Projetos de Lei
                        {selectedStatus && (
                          <span className="ml-2 text-sm font-normal text-gray-500">
                            ({filteredProjetos.length} projetos com status:{' '}
                            {selectedStatus})
                          </span>
                        )}
                      </h2>
                    </div>
                    <div className="flex gap-3">
                      <span
                        onClick={() => handleOnlyApprovedFilter(false)}
                        className="cursor-pointer rounded-full px-4 py-1 text-sm font-medium transition-all md:px-3"
                        style={{
                          backgroundColor: selectedStatus
                            ? `${getStatusColorHex(selectedStatus)}33`
                            : 'rgb(219 234 254)',
                          color: selectedStatus
                            ? getStatusColorHex(selectedStatus)
                            : 'rgb(30 64 175)',
                          ...(onlyApproved === false && {
                            boxShadow: `0 0 0 2px ${selectedStatus ? getStatusColorHex(selectedStatus) : 'rgb(147 197 253)'}`,
                          }),
                        }}
                      >
                        Total: {filteredProjetos?.length || 0}
                      </span>
                    </div>
                  </div>
                  {filteredProjetos?.length > 0 ? (
                    <div className="space-y-4">
                      {filteredProjetos.map((projeto) => (
                        <>
                          <div
                            key={projeto._id}
                            className="rounded-lg border p-4 transition-colors hover:bg-gray-50"
                          >
                            <h3 className="text-lg font-semibold">
                              {projeto.title}
                            </h3>
                            <p className="mt-2 text-gray-600">
                              {projeto.summary}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="rounded bg-gray-100 px-2 py-1 text-sm">
                                Status:{' '}
                                <span
                                  className={`${getStatusColor(projeto.status)} font-semibold`}
                                >
                                  {projeto.status}
                                </span>
                              </span>
                              <span className="rounded bg-gray-100 px-2 py-1 text-sm">
                                Ano:{' '}
                                <span className="font-semibold">
                                  {projeto.year}
                                </span>
                              </span>
                            </div>
                            <div className="mt-3 flex gap-3">
                              {projeto.textLink && (
                                <a
                                  href={handleClickProjeto(projeto)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:cursor-pointer hover:underline"
                                >
                                  Ver projeto completo
                                </a>
                              )}
                              {projeto.initialTextLink && (
                                <a
                                  href={projeto.initialTextLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  Ver texto inicial
                                </a>
                              )}
                            </div>
                          </div>
                          <span className="sr-only">
                            {projeto.title} com status {projeto.status} de
                            {projeto.year}.{projeto.summary}.
                          </span>
                        </>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      Nenhum projeto de lei encontrado para o vereador.
                      <span className="sr-only">
                        Nenhum projeto de lei encontrado para o vereador.
                      </span>
                    </p>
                  )}
                </div>
              ) : (
                <Spinner
                  className="mt-12"
                  size="large"
                  role="status"
                  aria-live="polite"
                />
              )}
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

export default withTextToSpeech(VereadorDetalhes);
