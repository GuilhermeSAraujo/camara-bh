import { FileCheck, Filter, SortAsc, Users } from 'lucide-react';
import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withTextToSpeech } from '../../components/TextToSpeech';
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/ui/Pagination';
import { ReturnButton } from '../../components/ui/ReturnButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/Select';
import { Spinner } from '../../components/ui/Spinner';
import { Switch } from '../../components/ui/Switch';
import { useMethodWithState } from '../../hooks/useMethodWithState';
import { getStatusColor } from '../../lib/utils';

function SearchProjetoDeLei() {
  const navigate = useNavigate();
  const [textSearch, setTextSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('Mais recentes');
  const [vereadorId, setVereadorId] = useState(null);
  const [chartTitle, setChartTitle] = useState('Projetos de Lei');
  const [onlyApproved, setOnlyApproved] = useState(false);

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // 9 cards por página (3x3 grid)

  const [data, { isLoading, refetch }] = useMethodWithState({
    method: 'ProjetosDeLei.search',
    params: { textSearch, sortOrder, vereadorId, onlyApproved },
    dependencyArray: [sortOrder, onlyApproved],
  });

  const [vereadoresSelect] = useMethodWithState({
    method: 'Vereadores.list',
    params: {},
    dependencyArray: [],
  });

  useEffect(() => {
    getChartTitle();
    // Reset para a primeira página quando os filtros mudam
    setCurrentPage(1);
  }, [data]);

  // Cálculos para paginação
  const totalItems = data?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Obter os itens da página atual
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data?.slice(startIndex, endIndex) || [];
  };

  const paginatedData = getCurrentPageItems();

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

    // Se o valor for "all", defina como null
    setVereadorId(value === 'all' ? null : value);
  }

  async function handleSearch() {
    await refetch();
    setCurrentPage(1); // Volta para a primeira página após uma nova pesquisa
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
      title += `Projetos de Lei propostos por ${vereador?.name || ''}`;
    }

    if (textSearch) {
      if (!title) {
        title += 'Projetos de Lei';
      }
      title += ` com as palavras-chave "${textSearch}"`;
    }

    if (!title) {
      title = 'Projetos de Lei';
    }

    setChartTitle(title);
  }

  function handleClickProjeto(projeto) {
    const baseUrl =
      'https://www.cmbh.mg.gov.br/atividade-legislativa/pesquisar-proposicoes/projeto-de-lei';

    // Projeto de Lei - 123/2010
    const number = projeto.title.split('- ')?.[1]?.split('/')?.[0]?.trim();
    const year = projeto.title.split('/')?.[1]?.trim();
    const url = `${baseUrl}/${number}/${year}`;

    window.open(url, '_blank');
  }

  async function handleClickVereador(e, projeto) {
    e.preventDefault();
    e.stopPropagation();

    const authorId = projeto.authorId._str || projeto.authorId;

    const vereador = await Meteor.callAsync('Vereadores.findById', {
      id: authorId,
    });

    if (vereador) {
      const vereadorId =
        vereador.idVereador || vereador._id?._str || vereador._id;
      navigate(`/vereador/${vereadorId}`);
    }
  }

  // Função para gerar links de paginação
  const generatePaginationItems = () => {
    const items = [];

    // Lógica para decidir quais números de página mostrar
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > 7) {
      // Se temos muitas páginas, mostramos um número limitado
      if (currentPage <= 4) {
        // Estamos no início
        endPage = 5;
      } else if (currentPage >= totalPages - 3) {
        // Estamos no final
        startPage = totalPages - 4;
      } else {
        // Estamos no meio
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    // Primeira página
    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
        </PaginationItem>
      );

      // Adiciona reticências se necessário
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Números de página
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Última página
    if (endPage < totalPages) {
      // Adiciona reticências se necessário
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => setCurrentPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div>
      <div className="m-4">
        <ReturnButton />
      </div>
      <div className="container mx-auto max-w-sm p-4 md:max-w-7xl">
        <div className="self-center">
          <h2 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl">
            Busque por <span className="underline">Projetos de Lei</span>
          </h2>
          <span className="sr-only">Busque por Projetos de Lei.</span>
        </div>

        {/* Filtros */}
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              type="text"
              className="w-full md:max-w-xs md:flex-grow"
              placeholder="Animais | Saúde | Educação | Esporte"
            />
            <span className="sr-only">
              Filtro por palavras-chave:{' '}
              {textSearch.length > 0 ? textSearch : 'Nenhum'}.
            </span>
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
              value={vereadorId || 'all'}
              onValueChange={handleSortVereadorChange}
            >
              <SelectTrigger className="w-full md:max-w-xs">
                <SelectValue placeholder="Selecione o Vereador(a)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os vereadores</SelectItem>
                {vereadoresSelect?.map((v) => (
                  <SelectItem key={v._id} value={v._id}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="sr-only">
              Filtro por vereador:{' '}
              {vereadorId
                ? vereadoresSelect?.find((v) => v._id === vereadorId)?.name
                : 'Nenhum'}
              .
            </span>
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
            <span className="sr-only">Ordenação por: {sortOrder}.</span>
          </div>

          {/* Filtro de aprovados */}
          <div className="grid grid-cols-1 gap-2 md:flex md:max-w-2xl md:items-center md:gap-3">
            <div className="flex items-center justify-between gap-2 md:flex-shrink-0 md:justify-start">
              <div className="flex items-center gap-2">
                <FileCheck size="20px" aria-hidden="true" />
                <Label htmlFor="onlyApprovedSwitch" className="text-md">
                  Apenas <span className="font-semibold">Aprovados</span>
                </Label>
              </div>
              <div className="flex items-center">
                <Switch
                  id="onlyApprovedSwitch"
                  checked={onlyApproved}
                  onCheckedChange={() => setOnlyApproved((v) => !v)}
                />
              </div>
            </div>
            <span className="sr-only">
              Filtro para apenas projetos aprovados?{' '}
              {onlyApproved ? 'Sim' : 'Não, todos'}.
            </span>
          </div>

          {/* Botão de pesquisa após todos os filtros */}
          <div className="mt-4 flex justify-start md:mt-2">
            <Button
              onClick={handleSearch}
              className="w-full bg-green-500 hover:bg-green-800 md:w-auto"
            >
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
            <div className="mt-8 text-center font-bold md:mt-4">
              {chartTitle}
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-600">
                Resultados encontrados:{' '}
                <span className="font-bold">{totalItems}</span>
                {totalItems > 0 && (
                  <span className="ml-2">
                    (Exibindo {(currentPage - 1) * itemsPerPage + 1} -{' '}
                    {Math.min(currentPage * itemsPerPage, totalItems)})
                  </span>
                )}
              </p>
              <span className="sr-only">
                Resultados encontrados: {totalItems}. (Exibindo{' '}
                {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, totalItems)}).
              </span>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {paginatedData.map((projeto) => (
                <React.Fragment key={projeto.title}>
                  <Card
                    className="flex h-full flex-col hover:cursor-pointer"
                    onClick={() => handleClickProjeto(projeto)}
                  >
                    <CardHeader>
                      <CardTitle className="text-xl">{projeto.title}</CardTitle>
                      <CardDescription
                        className="cursor-pointer hover:underline"
                        onClick={(e) => handleClickVereador(e, projeto)}
                      >
                        {projeto.author}
                      </CardDescription>
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
                  <span className="sr-only">
                    {projeto.title}.{projeto.author.replace('Ver.(a)', '')}.{' '}
                    {projeto.summary}. Ano: {projeto.year}. {projeto.status}.
                  </span>
                </React.Fragment>
              ))}
            </div>

            {/* Componente de Paginação */}
            {totalPages > 1 && (
              <Pagination className="no-tts mt-8">
                <PaginationContent className="flex flex-wrap gap-2">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      aria-disabled={currentPage === 1}
                      className={
                        currentPage === 1
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>

                  {generatePaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      aria-disabled={currentPage === totalPages}
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default withTextToSpeech(SearchProjetoDeLei);
