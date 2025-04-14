import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMethodWithState } from '../../hooks/useMethodWithState';

export function VereadorDetalhes() {
const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

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
    const id = vereador._id?._str || vereador._id;
    setVereadorId(id);
  }
  }, [vereador]);

const [projetosVereador] = useMethodWithState({
  method: 'ProjetosDeLei.porVereador',
  params: { 
    id: vereador?._id?._str || vereador?._id || vereadorId 
  },
  dependencyArray: [vereadorId, vereador],
  skip: !vereadorId && !vereador?._id
});

if (!vereador) return <div>Vereador não encontrado</div>;

const lastMandate = vereador.mandates?.[vereador.mandates.length - 1];
const imageUrl = findFirstAvailableImage(vereador.mandates);

return (
  <div className="flex h-screen">
    <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
      {/* Cabeçalho */}
      <div className="flex items-center mb-6">
        <img
          src={imageUrl}
          alt={vereador.name}
          className="h-32 w-32 rounded-full object-cover shadow-md mr-6"
          onError={(e) => {
            e.target.src = DEFAULT_AVATAR;
          }}
        />
        <div>
          <h1 className="text-3xl font-bold">{vereador.fullName}</h1>
          <p className="text-gray-600 mt-2">
            Mandato atual: {lastMandate?.startYear} - {lastMandate?.endYear}
          </p>
          <p className="text-sm text-gray-500">{lastMandate?.party}</p>
        </div>
      </div>
  
        {/* Mandatos */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Histórico de Mandatos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vereador.mandates?.map((mandato, index) => (
              <div 
                key={index} 
                className="border rounded-lg p-4 text-center"
              >
                <p className="font-semibold">
                  {mandato.startYear} - {mandato.endYear}
                </p>
                <p className="text-sm text-gray-500 mt-1">{mandato.party}</p>
              </div>
            ))}
          </div>
        </div>
  
        {/* Projetos de Lei */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Projetos de Lei</h2>
          {projetosVereador && projetosVereador.length > 0 ? (
            <div className="space-y-4">
              {projetosVereador.map((projeto) => (
                <div 
                  key={projeto._id?._str || projeto._id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-lg">{projeto.title}</h3>
                  <p className="text-gray-600 mt-2">{projeto.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                      Status: {projeto.status}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                      Ano: {projeto.year}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-3">
                    {projeto.textLink && (
                      <a
                        href={projeto.textLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Ver projeto completo
                      </a>
                    )}
                    {projeto.initialTextLink && (
                      <a
                        href={projeto.initialTextLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
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