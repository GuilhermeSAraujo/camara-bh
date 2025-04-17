// No componente Layout.jsx
import React, { Suspense, useState } from 'react';
import { AppSidebar } from './ui/AppSidebar';
import { useNavigate, Outlet } from 'react-router-dom';
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
import { Loading } from './Loading';

export default function Layout() {
  const navigate = useNavigate();
  const [breadcrumb, setBreadcrumb] = useState({
    group: 'Geral',
    groupUrl: '/', // Adicionar URL padrão para o grupo
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
            <Suspense fallback={<Loading name="suspense" />}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
