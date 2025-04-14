import { Filter, SortAsc } from 'lucide-react';
import React, { useState } from 'react';
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

  const [data, { isLoading, refetch }] = useMethodWithState({
    method: 'ProjetosDeLei.search',
    params: { textSearch, sortOrder },
    dependencyArray: [sortOrder],
  });

  function handleSortOrderChange(value) {
    if (value === sortOrder) {
      return;
    }

    setSortOrder(value);
  }

  async function handleSearch() {
    await refetch();
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
      )}
    </div>
  );
}
