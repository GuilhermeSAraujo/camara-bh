import React, { useEffect } from 'react';
import { Separator } from '../../components/ui/Separator';
import { useSidebar } from '../../components/ui/Sidebar';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card';

export function Home() {
  const { setOpen } = useSidebar();

  useEffect(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <div className="container mx-auto p-4 md:max-w-7xl">
      <div className="mb-20 grid grid-cols-1 items-center justify-around gap-6 md:grid-cols-3">
        <div className="col-span-6 space-y-4 text-left md:col-span-2 md:text-left">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Dashboard Câmara Municipal
          </h1>
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Belo Horizonte - Minas Gerais
          </h2>
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
        <Card>
          <CardHeader>
            <CardTitle>Aprovação de Leis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-center justify-center">
              <span>Gráfico de aprovação de leis</span>
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
