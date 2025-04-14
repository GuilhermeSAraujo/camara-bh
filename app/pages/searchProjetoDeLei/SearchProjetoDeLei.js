import { Filter, SortAsc, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/Select';
import { Spinner } from '../../components/ui/Spinner';
import { useMethodWithState } from '../../hooks/useMethodWithState';

function getStatusColor(status) {
  switch (status) {
    case 'Lei':
      return 'text-green-600';
    case 'Rejeitada':
      return 'text-red-600';
    case 'Em redação final':
      return 'text-blue-600';
    case 'Primeiro turno':
      return 'text-blue-600';
    case 'Segundo turno':
      return 'text-blue-600';
    case 'Proposição de Lei':
      return 'text-blue-600';
    case 'Retirada':
      return 'text-yellow-600';
    default:
      return 'text-gray-600';
  }
}

export default function SearchProjetoDeLei() {
  const [textSearch, setTextSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('Mais recentes');
  const [vereadorId, setVereadorId] = useState(null);
  const [partyId, setPartyId] = useState(null);

  const [chartTitle, setChartTitle] = useState('Projetos de Lei');

  const [data, { isLoading, refetch }] = useMethodWithState({
    method: 'ProjetosDeLei.search',
    params: { textSearch, sortOrder, vereadorId },
    dependencyArray: [sortOrder],
  });

  const [vereadoresSelect] = useMethodWithState({
    method: 'Vereadores.list',
    params: {},
    dependencyArray: [],
  });

  useEffect(() => {
    getChartTitle();
  }, [data]);

  function handleSortOrderChange(value) {
    if (value === sortOrder) {
      return;
    }

    setSortOrder(value);
  }

  function handleSortVereadorChange(value) {
    if (value === vereadorId) {
      return;
    }

    setVereadorId(value);
  }

  async function handleSearch() {
    await refetch();
  }

  function getChartTitle() {
    if (!data || data.length === 0) {
      setChartTitle(
        'Nenhum projeto de lei encontrado com os filtros aplicados'
      );
      return;
    }

    let title = '';
    if (vereadorId) {
      const vereador = vereadoresSelect.find((v) => v._id === vereadorId);
      title += `Projetos de Lei propostos por ${vereador.name}`;
    }

    if (textSearch) {
      if (!title) {
        title += 'Projetos de Lei';
      }
      title += ` com as palavras-chave "${textSearch}"`;
    }

    setChartTitle(title);
  }

  return (
    <div className="container mx-auto p-4 md:max-w-7xl">
      <div className="self-center">
        <h2 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl">
          Busque por <span className="underline">Projetos de Lei</span>
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4">
        {/* Filtro de pesquisa por palavras-chave */}
        <div className="grid grid-cols-1 gap-2 md:flex md:max-w-2xl md:items-center md:gap-3">
          {/* Label - em linha completa no mobile, inline no desktop */}
          <div className="flex items-center gap-2 md:flex-shrink-0">
            <Filter size="20px" aria-hidden="true" />
            <Label className="text-md whitespace-nowrap">
              Pesquise por palavras-chave
            </Label>
          </div>

          {/* Input de pesquisa */}
          <Input
            value={textSearch}
            onChange={(e) => setTextSearch(e.target.value)}
            type="text"
            className="w-full md:max-w-xs md:flex-grow"
            placeholder="Animais | Saúde | Educação | Esporte"
          />
        </div>

        {/* Filtro de vereadores */}
        <div className="grid grid-cols-1 gap-2 md:flex md:max-w-2xl md:items-center md:gap-3">
          <div className="flex items-center gap-2 md:flex-shrink-0">
            <Users size="20px" aria-hidden="true" />
            <Label className="text-md whitespace-nowrap">
              Filtrar por Vereador(a)
            </Label>
          </div>

          <Select
            value={vereadorId || undefined}
            onValueChange={handleSortVereadorChange}
          >
            <SelectTrigger className="w-full md:max-w-xs">
              <SelectValue placeholder="Selecione o Vereador(a)" />
            </SelectTrigger>
            <SelectContent>
              {vereadoresSelect?.map((v) => (
                <SelectItem key={v._id} value={v._id}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro de ordenação */}
        <div className="grid grid-cols-1 gap-2 md:flex md:max-w-2xl md:items-center md:gap-3">
          <div className="flex items-center gap-2 md:flex-shrink-0">
            <SortAsc size="20px" aria-hidden="true" />
            <Label className="text-md whitespace-nowrap">Ordenar por</Label>
          </div>

          <Select value={sortOrder} onValueChange={handleSortOrderChange}>
            <SelectTrigger className="w-full md:max-w-xs">
              <SelectValue placeholder="Selecione a ordenação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mais recentes">Mais recentes</SelectItem>
              <SelectItem value="Mais antigos">Mais antigos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Botão de pesquisa após todos os filtros */}
        <div className="mt-2 flex justify-start">
          <Button onClick={handleSearch} className="w-full md:w-auto">
            Pesquisar
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Spinner
          className="mt-12"
          size="large"
          role="status"
          aria-live="polite"
        />
      ) : (
        <div>
          <div className="mt-4 text-center font-bold">{chartTitle}</div>
          <div className="mt-2 text-center">
            <p className="text-sm text-gray-600">
              Resultados encontrados: {data?.length || 0}
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {data?.map((projeto) => (
              <Card key={projeto._id} className="flex h-full flex-col">
                <CardHeader>
                  <CardTitle className="text-xl">{projeto.title}</CardTitle>
                  <CardDescription>{projeto.author}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>{projeto.summary}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Ano: {projeto.year}
                  </span>
                  <span
                    className={`font-medium ${getStatusColor(projeto.status)}`}
                  >
                    {projeto.status}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
