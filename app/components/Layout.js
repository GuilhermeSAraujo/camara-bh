import React, { useState } from 'react';
import { AppSidebar } from './ui/AppSidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/Breadcrumb';
import { Separator } from './ui/Separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from './ui/Sidebar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const [breadcrumb, setBreadcrumb] = useState({
    group: 'Geral',
  });

  return (
    <SidebarProvider>
      <AppSidebar setBreadcrumb={setBreadcrumb} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink
                  href="#"
                  onClick={(e) => console.log('olá!', e.target)}
                >
                  {breadcrumb?.group || 'Geral'}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumb?.title && (
                <BreadcrumbSeparator className="hidden md:block" />
              )}
              <BreadcrumbItem>
                <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
