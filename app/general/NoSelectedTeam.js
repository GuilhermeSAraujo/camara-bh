import { MousePointerClick } from 'lucide-react';
import React from 'react';

export function NoSelectedTeam() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <MousePointerClick className="mb-4 h-12 w-12 text-muted-foreground" />

      <span className="text-2xl text-muted-foreground">Select a team</span>
    </div>
  );
}
