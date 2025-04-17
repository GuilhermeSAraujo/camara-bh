import React, { useEffect } from 'react';
import { useSidebar } from '../../components/ui/Sidebar';

import { BarChart2, Search, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card';
import { RoutePaths } from '../../general/RoutePaths';
import { withTextToSpeech } from '../../components/TextToSpeech';

function Home() {
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

  const cardData = [
    {
      title: 'Análise de Propostas',
      description:
        'Veja estatísticas de projetos de lei por vereador, partido e mandato. Compare dados e acompanhe o desempenho legislativo dos representantes da cidade.',
      icon: {
        element: <BarChart2 size="30px" />,
        onClick: () => handleCardRedirect(RoutePaths.PROJETOS_DE_LEI),
      },
      bgColor: 'bg-yellow-400',
    },
    {
      title: 'Busca por Projetos de Lei',
      description:
        'Encontre projetos de lei específicos utilizando palavras-chave. Pesquise por temas de seu interesse e acompanhe as iniciativas legislativas relacionadas à sua comunidade.',
      icon: {
        element: <Search size="30px" />,
        onClick: () => handleCardRedirect(RoutePaths.BUSCAR),
      },
      bgColor: 'bg-blue-500',
    },
    {
      title: 'Vereadores',
      description:
        'Consulte informações detalhadas sobre os vereadores, incluindo projetos apresentados, mandatos exercidos e afiliações partidárias. Conheça melhor seus representantes na Câmara Municipal.',
      icon: {
        element: <Users size="30px" />,
        onClick: () => handleCardRedirect(RoutePaths.VEREADORES),
      },
      bgColor: 'bg-green-500',
    },
  ];

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
            src="/brasao-bh.png"
            loading="lazy"
            alt="Bandeira de Belo Horizonte"
            className="h-auto w-full max-w-[230px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cardData.map((card, index) => (
          <CardItem
            key={index}
            title={card.title}
            description={card.description}
            icon={card.icon}
            bgColor={card.bgColor}
          />
        ))}
      </div>
    </div>
  );
}

function CardItem({ title, description, icon, bgColor }) {
  return (
    <Card
      className="cursor-pointer transition-shadow duration-300 hover:shadow-xl"
      onClick={icon.onClick}
    >
      <CardHeader>
        <CardTitle>
          <div className="flex place-items-center justify-between">
            {title}
            <div
              className={`justify-between rounded-full ${bgColor} p-2 opacity-80`}
            >
              {icon.element}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-40 items-center text-justify">
          <span>{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default withTextToSpeech(Home);
