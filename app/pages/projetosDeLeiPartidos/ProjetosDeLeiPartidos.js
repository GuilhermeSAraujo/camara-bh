import { FileCheck } from 'lucide-react';
import React, { useState } from 'react';
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartDetailsModal } from '../../components/ui/ChartDetailsModal';
import { Label } from '../../components/ui/Label';
import { Spinner } from '../../components/ui/Spinner';
import { Switch } from '../../components/ui/Switch';
import { useMethodWithState } from '../../hooks/useMethodWithState';

export default function ProjetosDeLeiPartidos() {
  const [onlyApproved, setOnlyApproved] = useState(false);

  const [data, { isLoading }] = useMethodWithState({
    method: 'ProjetosDeLei.partidos',
    params: { onlyApproved },
    dependencyArray: [onlyApproved],
  });

  return (
    <div>
      <div className="container mx-auto max-w-xs p-4 md:max-w-7xl">
        <div className="self-center">
          <h2 className="scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl">
            <span className="underline">Projetos de Lei</span> propostos e
            aprovados por <span className="underline">Partido</span>
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-1 md:gap-6">
          <div className="flex items-center">
            <FileCheck size="20px" />
            <Label id="onlyApproved" className="text-md px-3">
              Apenas <span className="font-semibold">Aprovados</span>
            </Label>
            <Switch
              checked={onlyApproved}
              onCheckedChange={() => setOnlyApproved((v) => !v)}
              htmlFor="onlyApproved"
            />
          </div>
          <div className="flex justify-start">
            <ChartDetailsModal />
          </div>
        </div>
      </div>

      <div>
        {isLoading ? (
          <Spinner className="mt-12" size="large" />
        ) : data?.length > 0 ? (
          <div className="mt-10 gap-4">
            <BarChart width={1024} height={500} data={data}>
              <XAxis dataKey="party" />
              <YAxis />
              <Tooltip
                formatter={(value, name, props) => [
                  props.payload.fullParty,
                  'Partido',
                ]}
              />
              <Bar dataKey="value" />
            </BarChart>
          </div>
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
