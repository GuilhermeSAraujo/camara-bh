import React, { Suspense, useState, lazy } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Loading } from './Loading';

// Lazy load named exports from UI modules
const AppSidebar = lazy(() =>
  import('./ui/AppSidebar').then((mod) => ({ default: mod.AppSidebar }))
);
const Separator = lazy(() =>
  import('./ui/Separator').then((mod) => ({ default: mod.Separator }))
);
const {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} = {
  Breadcrumb: lazy(() =>
    import('./ui/Breadcrumb').then((mod) => ({ default: mod.Breadcrumb }))
  ),
  BreadcrumbList: lazy(() =>
    import('./ui/Breadcrumb').then((mod) => ({ default: mod.BreadcrumbList }))
  ),
  BreadcrumbItem: lazy(() =>
    import('./ui/Breadcrumb').then((mod) => ({ default: mod.BreadcrumbItem }))
  ),
  BreadcrumbLink: lazy(() =>
    import('./ui/Breadcrumb').then((mod) => ({ default: mod.BreadcrumbLink }))
  ),
  BreadcrumbPage: lazy(() =>
    import('./ui/Breadcrumb').then((mod) => ({ default: mod.BreadcrumbPage }))
  ),
  BreadcrumbSeparator: lazy(() =>
    import('./ui/Breadcrumb').then((mod) => ({
      default: mod.BreadcrumbSeparator,
    }))
  ),
};
const SidebarInset = lazy(() =>
  import('./ui/Sidebar').then((mod) => ({ default: mod.SidebarInset }))
);
const SidebarProvider = lazy(() =>
  import('./ui/Sidebar').then((mod) => ({ default: mod.SidebarProvider }))
);
const SidebarTrigger = lazy(() =>
  import('./ui/Sidebar').then((mod) => ({ default: mod.SidebarTrigger }))
);

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
    <Suspense fallback={<Loading name="layout" />}>
      <SidebarProvider>
        <Suspense fallback={<Loading name="app-sidebar" />}>
          <AppSidebar setBreadcrumb={setBreadcrumb} />
        </Suspense>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <Suspense fallback={<Loading name="sidebar-trigger" />}>
              <SidebarTrigger className="-ml-1" />
            </Suspense>
            <Suspense fallback={<Loading name="separator" />}>
              <Separator orientation="vertical" className="mr-2 h-4" />
            </Suspense>

            {/* Lazy-loaded breadcrumb with its own Suspense fallback */}
            <Suspense fallback={<Loading name="breadcrumb" />}>
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
            </Suspense>
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
    </Suspense>
  );
}
