import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMethodWithState } from '../../hooks/useMethodWithState';
import { Spinner } from '../../components/ui/Spinner';
import { getStatusColor } from '../../lib/utils';

export function VereadorDetalhes() {
  const DEFAULT_AVATAR =
    'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  const { idVereador } = useParams();
  const [onlyApproved, setOnlyApproved] = useState(false);

  const findFirstAvailableImage = (mandates) => {
    if (!mandates || !Array.isArray(mandates)) return DEFAULT_AVATAR;

    for (let i = mandates.length - 1; i >= 0; i--) {
      if (mandates[i]?.imgUrl) {
        return mandates[i].imgUrl;
      }
    }

    return DEFAULT_AVATAR;
  };

  const [vereador, { isLoading: isLoadingVereador }] = useMethodWithState({
    method: 'Vereadores.findById',
    params: { id: idVereador },
    dependencyArray: [idVereador],
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

  function handleClickProjeto(projeto) {
    const baseUrl =
      'https://www.cmbh.mg.gov.br/atividade-legislativa/pesquisar-proposicoes/projeto-de-lei';

    // Projeto de Lei - 123/2010
    const number = projeto.title.split('- ')?.[1].split('/')?.[0].trim();
    const year = projeto.title.split('/')?.[1].trim();
    const url = `${baseUrl}/${number}/${year}`;

    return url;
  }

  function handleOnlyApprovedFilter(filter) {
    if (filter === onlyApproved) {
      setOnlyApproved(false);
      return;
    }

    setOnlyApproved(filter);
  }

  if (!vereador) return <div>Vereador não encontrado</div>;

  const lastMandate = vereador.mandates?.[vereador.mandates.length - 1];
  const imageUrl = findFirstAvailableImage(vereador.mandates);

  return (
    <div className="container mx-auto p-4 md:max-w-7xl">
      <main className="flex-1 bg-gray-100">
        {/* Cabeçalho */}
        <div className="mb-6 flex items-center">
          <img
            src={imageUrl}
            alt={vereador.name}
            className="mr-6 h-32 w-32 rounded-full object-cover shadow-md"
            onError={(e) => {
              e.target.src = DEFAULT_AVATAR;
            }}
          />
          <div>
            <h1 className="text-3xl font-bold">{vereador.fullName}</h1>
            <p className="mt-2 text-gray-600">
              Mandato mais recente:{' '}
              <span className="font-semibold">
                {lastMandate?.startYear} - {lastMandate?.endYear}
              </span>
            </p>
            <p className="text-sm font-semibold text-gray-500">
              {lastMandate?.party}
            </p>
          </div>
        </div>

        {/* Mandatos */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">Histórico de Mandatos</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {isLoadingVereador ? (
              <Spinner
                className="mt-12"
                size="large"
                role="status"
                aria-live="polite"
              />
            ) : (
              vereador.mandates?.map((mandato, index) => (
                <div key={index} className="rounded-lg border p-4 text-center">
                  <p className="font-semibold">
                    {mandato.startYear} - {mandato.endYear}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{mandato.party}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Projetos de Lei */}
        <div className="rounded-lg bg-white p-6 shadow">
          {!isLoadingLeis ? (
            <>
              <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-3 w-full text-left md:mb-0 md:w-auto">
                  <h2 className="text-xl font-bold">Projetos de Lei</h2>
                </div>
                <div className="flex gap-3">
                  <span
                    onClick={() => handleOnlyApprovedFilter(false)}
                    className={`cursor-pointer rounded-full px-4 py-1 text-sm font-medium md:px-3 ${
                      onlyApproved === false
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    Total: {data?.total || 0}
                  </span>
                  <span
                    onClick={() => handleOnlyApprovedFilter(true)}
                    className={`cursor-pointer rounded-full px-4 py-1 text-sm font-medium md:px-3 ${
                      onlyApproved === true
                        ? 'bg-green-600 text-white ring-2 ring-green-300'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    Aprovados: {data?.aprovados || 0}
                  </span>
                </div>
              </div>
              {data?.projetosDeLei?.length > 0 ? (
                <div className="space-y-4">
                  {data?.projetosDeLei?.map((projeto) => (
                    <div
                      key={projeto._id}
                      className="rounded-lg border p-4 transition-colors hover:bg-gray-50"
                    >
                      <h3 className="text-lg font-semibold">{projeto.title}</h3>
                      <p className="mt-2 text-gray-600">{projeto.summary}</p>
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
                          <span className="font-semibold">{projeto.year}</span>
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
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">
                  Nenhum projeto de lei encontrado.
                </p>
              )}
            </>
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
    </div>
  );
}
