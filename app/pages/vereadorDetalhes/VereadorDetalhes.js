import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMethodWithState } from '../../hooks/useMethodWithState';

export function VereadorDetalhes() {
  const DEFAULT_AVATAR =
    'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  const { idVereador } = useParams();
  const [vereadorId, setVereadorId] = useState(null);

  const findFirstAvailableImage = (mandates) => {
    if (!mandates || !Array.isArray(mandates)) return DEFAULT_AVATAR;

    for (let i = mandates.length - 1; i >= 0; i--) {
      if (mandates[i]?.imgUrl) {
        return mandates[i].imgUrl;
      }
    }

    return DEFAULT_AVATAR;
  };

  const [vereador] = useMethodWithState({
    method: 'Vereadores.find',
    params: { id: idVereador },
    dependencyArray: [idVereador],
  });

  useEffect(() => {
    if (vereador) {
      const id = vereador._id;
      setVereadorId(id);
    }
  }, [vereador]);

  const [projetosVereador] = useMethodWithState({
    method: 'ProjetosDeLei.porVereador',
    params: {
      id: vereador?._id || vereadorId,
    },
    dependencyArray: [vereadorId, vereador],
  });

  if (!vereador) return <div>Vereador não encontrado</div>;

  const lastMandate = vereador.mandates?.[vereador.mandates.length - 1];
  const imageUrl = findFirstAvailableImage(vereador.mandates);

  return (
    <div className="flex h-screen">
      <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
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
              Mandato atual: {lastMandate?.startYear} - {lastMandate?.endYear}
            </p>
            <p className="text-sm text-gray-500">{lastMandate?.party}</p>
          </div>
        </div>

        {/* Mandatos */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">Histórico de Mandatos</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {vereador.mandates?.map((mandato, index) => (
              <div key={index} className="rounded-lg border p-4 text-center">
                <p className="font-semibold">
                  {mandato.startYear} - {mandato.endYear}
                </p>
                <p className="mt-1 text-sm text-gray-500">{mandato.party}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Projetos de Lei */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Projetos de Lei</h2>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              Total: {projetosVereador?.length || 0}
            </span>
          </div>
          {projetosVereador && projetosVereador.length > 0 ? (
            <div className="space-y-4">
              {projetosVereador.map((projeto) => (
                <div
                  key={projeto._id?._str || projeto._id}
                  className="rounded-lg border p-4 transition-colors hover:bg-gray-50"
                >
                  <h3 className="text-lg font-semibold">{projeto.title}</h3>
                  <p className="mt-2 text-gray-600">{projeto.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded bg-gray-100 px-2 py-1 text-sm">
                      Status: {projeto.status}
                    </span>
                    <span className="rounded bg-gray-100 px-2 py-1 text-sm">
                      Ano: {projeto.year}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-3">
                    {projeto.textLink && (
                      <a
                        href={projeto.textLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
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
            <p className="text-gray-600">Nenhum projeto de lei encontrado.</p>
          )}
        </div>
      </main>
    </div>
  );
}
