import React, { useState, useMemo } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import { VereadoresCollection } from '../../api/vereadores/collection';

export default function Vereadores() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParty, setSelectedParty] = useState('');

  const DEFAULT_AVATAR =
    'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  const removeAccents = (str) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const findFirstAvailableImage = (mandates) => {
    if (!mandates || !Array.isArray(mandates)) return DEFAULT_AVATAR;

    for (let i = mandates.length - 1; i >= 0; i--) {
      if (mandates[i]?.imgUrl) {
        return mandates[i].imgUrl;
      }
    }

    return DEFAULT_AVATAR;
  };

  const { vereadores, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe('vereadores');
    return {
      vereadores: VereadoresCollection.find(
        {},
        {
          sort: { name: 1 },
        }
      ).fetch(),
      isLoading: !handle.ready(),
    };
  });

  const parties = useMemo(() => {
    if (!vereadores) return [];
    const partySet = new Set();
    vereadores.forEach((vereador) => {
      const lastMandate = vereador.mandates?.[vereador.mandates.length - 1];
      if (lastMandate?.party) {
        partySet.add(lastMandate.party);
      }
    });
    return Array.from(partySet).sort();
  }, [vereadores]);

  const filteredVereadores = useMemo(() => {
    if (!vereadores) return [];

    const normalizedSearchTerm = removeAccents(searchTerm.toLowerCase());

    return vereadores.filter((vereador) => {
      const lastMandate = vereador.mandates?.[vereador.mandates.length - 1];

      const normalizedName = removeAccents(vereador.name.toLowerCase());
      const normalizedFullName = removeAccents(vereador.fullName.toLowerCase());

      const matchesSearch =
        searchTerm === '' ||
        normalizedName.includes(normalizedSearchTerm) ||
        normalizedFullName.includes(normalizedSearchTerm);

      const matchesParty =
        selectedParty === '' || lastMandate?.party === selectedParty;

      return matchesSearch && matchesParty;
    });
  }, [vereadores, searchTerm, selectedParty]);

  const handleVereadorClick = (vereador) => {
    const id = vereador.idVereador || vereador._id?._str || vereador._id;
    navigate(`/vereador/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-6 text-4xl font-bold">Vereadores</h2>

      {/* Filtros */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={selectedParty}
            onChange={(e) => setSelectedParty(e.target.value)}
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os partidos</option>
            {parties.map((party) => (
              <option key={party} value={party}>
                {party}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resultados */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {filteredVereadores.map((vereador) => {
          const lastMandate = vereador.mandates?.[vereador.mandates.length - 1];
          const imageUrl = findFirstAvailableImage(vereador.mandates);
          const uniqueKey =
            vereador.idVereador || vereador._id?._str || vereador._id;

          return (
            <div
              key={uniqueKey}
              className="flex cursor-pointer flex-col items-center rounded-lg p-4 transition-colors hover:bg-gray-50"
              onClick={() => handleVereadorClick(vereador)}
            >
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={vereador.name}
                  className="h-24 w-24 rounded-full object-cover shadow-md"
                  onError={(e) => {
                    e.target.src = DEFAULT_AVATAR;
                  }}
                />
                {lastMandate?.party && (
                  <span className="absolute bottom-0 right-0 rounded-full bg-blue-500 px-2 py-1 text-xs text-white">
                    {lastMandate.party}
                  </span>
                )}
              </div>
              <p className="mt-2 text-center text-sm font-medium">
                {vereador.name}
              </p>
              <p className="text-center text-xs text-gray-500">
                {lastMandate?.startYear} - {lastMandate?.endYear}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mensagem quando não há resultados */}
      {filteredVereadores.length === 0 && (
        <div className="mt-8 text-center text-gray-500">
          Nenhum vereador encontrado com os filtros selecionados.
        </div>
      )}
    </div>
  );
}
