import { FileCheck, Filter } from 'lucide-react';
import { Meteor } from 'meteor/meteor';
import React, { Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withTextToSpeech } from '../../components/TextToSpeech';
import { Label } from '../../components/ui/Label';
import { ReturnButton } from '../../components/ui/ReturnButton';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/Select';
import { Spinner } from '../../components/ui/Spinner';
import { Switch } from '../../components/ui/Switch';
import { useMethodWithState } from '../../hooks/useMethodWithState';

const ChartDetailsModal = React.lazy(
  () => import('../../components/ui/ChartDetailsModal')
);
const ProjetosDeLeiList = React.lazy(
  () =>
    new Promise((resolve) => {
      import('./ProjetosDeLeiList').then((module) => {
        setTimeout(() => {
          resolve(module);
        }, 100);
      });
    })
);

const filterOptions = ['2013;2016', '2017;2020', '2021;2024'];

function ProjetosDeLei() {
  const navigate = useNavigate();
  const [mandato, setMandato] = useState('2021;2024');
  const [onlyApproved, setOnlyApproved] = useState(false);

  const [data, { isLoading }] = useMethodWithState({
    method: 'ProjetosDeLei.aprovados',
    params: { mandato, onlyApproved },
    dependencyArray: [mandato, onlyApproved],
  });

  function handleChangeMandato(value) {
    if (value === mandato) return;
    setMandato(value);
  }

  async function handleClickVereador(e, authorId) {
    e.stopPropagation();
    try {
      const vereador = await Meteor.callAsync('Vereadores.findById', {
        id: authorId,
      });
      const vereadorId =
        vereador.idVereador || vereador._id?._str || vereador._id;
      navigate(`/vereador/${vereadorId}`);
    } catch (error) {
      console.error('Erro ao buscar vereador:', error);
    }
  }

  return (
    <div>
      <div className="m-4">
        <ReturnButton />
      </div>
      <div className="container mx-auto p-4 md:max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl">
            <span className="underline">Projetos de Lei</span> propostos e
            aprovados por <span className="underline">Vereador</span>
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-1 md:gap-6">
          <div className="flex items-center">
            <Filter size="20px" aria-hidden="true" />
            <Label className="text-md px-3">Selecione o mandato</Label>
            <Select
              value={mandato}
              onValueChange={handleChangeMandato}
              aria-label="Selecione o mandato"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o mandato desejado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Mandatos</SelectLabel>
                  {filterOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year.replace(';', ' - ')}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center">
            <FileCheck size="20px" aria-hidden="true" />
            <Label htmlFor="onlyApprovedSwitch" className="text-md px-3">
              Apenas <span className="font-semibold">Aprovados</span>
            </Label>
            <Switch
              id="onlyApprovedSwitch"
              checked={onlyApproved}
              onCheckedChange={() => setOnlyApproved((v) => !v)}
            />
          </div>
          <div className="flex justify-start">
            <Suspense
              fallback={
                <Spinner
                  className="mt-12"
                  size="large"
                  role="status"
                  aria-live="polite"
                />
              }
            >
              <ChartDetailsModal />
            </Suspense>
          </div>
        </div>

        {isLoading ? (
          <Spinner
            className="mt-12"
            size="large"
            role="status"
            aria-live="polite"
          />
        ) : data?.length > 0 ? (
          <Suspense
            fallback={
              <Spinner
                className="mt-12"
                size="large"
                role="status"
                aria-live="polite"
              />
            }
          >
            <ProjetosDeLeiList
              data={data}
              mandato={mandato}
              onlyApproved={onlyApproved}
              onClickVereador={handleClickVereador}
            />
          </Suspense>
        ) : (
          <div className="mt-12 text-center">
            <h3 className="text-lg">
              Nenhum projeto foi aprovado até o momento!
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default withTextToSpeech(ProjetosDeLei);
