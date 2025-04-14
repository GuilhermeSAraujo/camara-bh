import { Loader2 } from 'lucide-react';
import React from 'react';

export function Loading() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Loader2 className="animate-spin" size={30} />
    </div>
  );
}
