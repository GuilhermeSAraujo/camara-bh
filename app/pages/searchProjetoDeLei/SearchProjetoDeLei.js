import { Filter } from 'lucide-react';
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
    case 'Retirada':
      return 'text-yellow-600';
    default:
      return 'text-gray-600';
  }
}

export default function SearchProjetoDeLei() {
  const [textSearch, setTextSearch] = useState('');

  const [data, { isLoading, refetch }] = useMethodWithState({
    method: 'ProjetosDeLei.search',
    params: { textSearch },
    dependencyArray: [],
  });

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

          {/* Input e botão em proporção 3/4 e 1/4 no mobile, inline no desktop */}
          <div className="grid w-full grid-cols-4 gap-2 md:flex md:flex-grow md:gap-3">
            <Input
              value={textSearch}
              onChange={(e) => setTextSearch(e.target.value)}
              type="text"
              className="col-span-3 md:max-w-md md:flex-grow"
              placeholder="Animais | Saúde | Educação | Esporte"
            />
            <Button
              onClick={handleSearch}
              className="col-span-1 md:flex-shrink-0"
            >
              Pesquisar
            </Button>
          </div>
        </div>

        {/* Espaço reservado para filtros adicionais */}
        {/* outros filtros serão adicionados aqui */}
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
