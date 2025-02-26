import { InfoIcon } from 'lucide-react';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/Dialog';
import { Label } from '../../components/ui/Label';
import { PARTY_COLOR } from '../../lib/consts';

export function ChartDetailsModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex place-items-center hover:cursor-pointer">
          <InfoIcon size="20px" />
          <Label className="text-md px-3 hover:cursor-pointer hover:underline">
            Entenda melhor o gráfico
          </Label>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-6">Vereadores x Partidos</DialogTitle>
          <DialogDescription asChild>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(PARTY_COLOR).map(([party, color]) => (
                <div key={party} className="flex flex-col items-center">
                  <div
                    className="mb-1 h-6 w-6 rounded-md"
                    style={{ backgroundColor: color }}
                  />
                  <p className="text-center text-xs">{party}</p>
                </div>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
