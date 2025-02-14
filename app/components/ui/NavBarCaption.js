import { GalleryVerticalEnd } from 'lucide-react';
import * as React from 'react';

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '../../general/RoutePaths';

export function NavBarCaption() {
  const navigate = useNavigate();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <div
            className="flex cursor-pointer flex-col gap-0.5 leading-none"
            onClick={() => navigate(RoutePaths.APP)}
          >
            <span className="font-semibold">Câmara Municipal</span>
            <span className="">Belo Horizonte - MG</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
