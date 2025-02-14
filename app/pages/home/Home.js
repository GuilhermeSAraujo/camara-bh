import React, { useEffect } from 'react';
import { useSidebar } from '../../components/ui/Sidebar';

import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card';
import { RoutePaths } from '../../general/RoutePaths';
import { Scale } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();

  const { setOpen } = useSidebar();

  useEffect(() => {
    setOpen(false);

    return () => {
      setOpen(true);
    };
  }, []);

  function handleCardRedirect(route) {
    navigate(route);
  }

  return (
    <div className="container mx-auto p-4 md:max-w-7xl">
      <div className="mb-20 grid grid-cols-1 items-center justify-around gap-6 md:grid-cols-3">
        <div className="col-span-1 space-y-4 text-left md:col-span-2 md:text-left">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Transparência na Câmara Municipal
          </h1>
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Belo Horizonte - Minas Gerais
          </h2>
          <p className="leading-7">
            Acompanhe de forma clara e acessível o trabalho dos vereadores de
            Belo Horizonte. Explore dados sobre projetos de lei, presença nas
            sessões e outras informações relevantes para a cidade.
          </p>
        </div>
        <div className="col-span-1 flex w-full items-center justify-center md:col-span-1">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Bras%C3%A3o-Belo-Horizonte.svg/1200px-Bras%C3%A3o-Belo-Horizonte.svg.png"
            alt="Bandeira de Belo Horizonte"
            className="h-auto w-full max-w-[230px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card
          style={{ cursor: 'pointer' }}
          onClick={() => handleCardRedirect(RoutePaths.PROJETOS_DE_LEI)}
        >
          <CardHeader>
            <CardTitle>
              <div className="flex place-items-center">
                Projetos de Lei{' '}
                <Scale className="ml-4" size="30px" color="gray" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-center text-justify">
              <span>
                Veja quantos projetos de lei foram aprovados por cada vereador,
                partido e mandato. Compare o desempenho e acompanhe as propostas
                que impactam a cidade.
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Participação e Engajamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-center justify-center">
              <span>Gráfico de participação e engajamento</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Presença</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-center justify-center">
              <span>Gráfico da lista de presença</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
