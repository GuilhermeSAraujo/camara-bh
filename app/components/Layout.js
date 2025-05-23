import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Loading } from './Loading';
import { AppSidebar } from './ui/AppSidebar';
import { Separator } from './ui/Separator';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/Breadcrumb';
import { SidebarInset, SidebarProvider, SidebarTrigger } from './ui/Sidebar';

export default function Layout() {
  const navigate = useNavigate();
  const [breadcrumb, setBreadcrumb] = useState({
    group: 'Geral',
    groupUrl: '/',
  });

  const handleBreadcrumbClick = (url, e) => {
    e.preventDefault();
    navigate(url);
  };

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
                  href={breadcrumb.groupUrl || '/'}
                  onClick={(e) =>
                    handleBreadcrumbClick(breadcrumb.groupUrl || '/', e)
                  }
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
