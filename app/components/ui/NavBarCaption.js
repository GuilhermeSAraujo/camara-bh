import * as React from 'react';

import { RoutePaths } from '../../general/RoutePaths';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './Sidebar';

export function NavBarCaption({ handleItemClick }) {
  function handleRedirect() {
    handleItemClick({ group: 'Home', url: RoutePaths.APP });
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="xl"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-12 items-center justify-center rounded-lg text-sidebar-primary-foreground">
            <img
              src="/brasao-bh.png"
              alt="Brasão de Belo Horizonte"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width="48"
              height="48"
            />
          </div>
          <div
            className="flex cursor-pointer flex-col gap-0.5 leading-none"
            onClick={handleRedirect}
          >
            <span className="font-semibold">Câmara Municipal</span>
            <span className="">Belo Horizonte - MG</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
