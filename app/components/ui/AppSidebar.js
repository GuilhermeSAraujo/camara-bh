import { MessageSquarePlus } from 'lucide-react';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RoutePaths } from '../../general/RoutePaths';
import { NavBarCaption } from './NavBarCaption';
import { Separator } from './Separator';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from './Sidebar';

// Import shadcn/ui components
import { FeedbackDialog } from '../FeedbackDialog';
import { Button } from './Button';

// Dados de exemplo
const data = {
  navMain: [
    {
      title: 'Projetos de Lei',
      url: RoutePaths.BUSCAR,
      ariaLabel: 'Menu de projetos de lei',
      items: [
        {
          title: 'Buscar',
          url: RoutePaths.BUSCAR,
          ariaLabel: 'Buscar projetos de lei',
        },
        {
          title: 'Por Vereadores',
          url: RoutePaths.PROJETOS_DE_LEI,
          ariaLabel: 'Ver projetos de lei por vereadores',
        },
        {
          title: 'Por Partidos',
          url: RoutePaths.PROJETOS_DE_LEI_POR_PARTIDOS,
          ariaLabel: 'Ver projetos de lei por partidos',
        },
      ],
    },
    {
      title: 'Vereador',
      url: RoutePaths.VEREADORES,
      ariaLabel: 'Vereador',
      items: [
        {
          title: 'Vereadores',
          url: RoutePaths.VEREADORES,
          ariaLabel: 'Ver informações sobre vereadores',
        },
      ],
    },
  ],
};

export function AppSidebar({ setBreadcrumb, ...props }) {
  const location = useLocation();
  const navigate = useNavigate();
  // Pegamos também setOpenMobile e isMobile do contexto
  const { isMobile, setOpenMobile } = useSidebar();

  // Estado para controlar o dialog de feedback
  const [dialogOpen, setDialogOpen] = useState(false);

  // Init navItems marcando o ativo pela rota
  const initializeNavItems = () =>
    data.navMain.map((group) => ({
      ...group,
      items: group.items.map((item) => ({
        ...item,
        isActive: item.url === location.pathname,
      })),
    }));

  const [navItems, setNavItems] = useState(initializeNavItems);
  const [expandedGroups, setExpandedGroups] = useState({});

  const toggleGroup = (groupTitle) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupTitle]: !prev[groupTitle],
    }));
  };

  const handleItemClick = ({ group, title, url }) => {
    // Atualiza breadcrumb
    const groupData = navItems.find((g) => g.title === group);
    const groupUrl = groupData ? groupData.url : '/';
    setBreadcrumb({ group, title, groupUrl, itemUrl: url });

    // Atualiza ativo
    setNavItems(
      navItems.map((navGroup) => ({
        ...navGroup,
        items: navGroup.items.map((item) => ({
          ...item,
          isActive: item.title === title,
        })),
      }))
    );

    window.scrollTo(0, 0);

    // FECHA A SIDEBAR DEPENDENDO DO DISPOSITIVO
    if (isMobile) {
      setOpenMobile(false);
    }

    navigate(url);
    window.scrollTo(0, 0);
  };

  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <Sidebar {...props} aria-label="Navegação principal do site">
      <SidebarHeader>
        <NavBarCaption handleItemClick={handleItemClick} />
      </SidebarHeader>
      <SidebarContent className="md:mt-3">
        <nav aria-label="Menu de navegação principal">
          {navItems.map((group, i) => {
            const isExpanded = expandedGroups[group.title] !== false;
            const safeId = group.title.replace(/\s+/g, '-').toLowerCase();
            const groupId = `group-${safeId}`;
            const menuId = `menu-${safeId}`;

            return (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel
                  id={groupId}
                  onClick={() => toggleGroup(group.title)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, () => toggleGroup(group.title))
                  }
                  aria-expanded={isExpanded}
                  aria-controls={menuId}
                  tabIndex={0}
                  role="button"
                  aria-label={group.ariaLabel || group.title}
                >
                  {group.title}
                </SidebarGroupLabel>
                <SidebarGroupContent
                  id={menuId}
                  aria-labelledby={groupId}
                  hidden={!isExpanded}
                >
                  <SidebarMenu role="menu">
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.title} role="none">
                        <SidebarMenuButton
                          role="menuitem"
                          isActive={item.isActive}
                          onClick={() =>
                            handleItemClick({
                              group: group.title,
                              title: item.title,
                              url: item.url,
                            })
                          }
                          onKeyDown={(e) =>
                            handleKeyDown(e, () =>
                              handleItemClick({
                                group: group.title,
                                title: item.title,
                                url: item.url,
                              })
                            )
                          }
                          aria-label={item.ariaLabel || item.title}
                          aria-current={item.isActive ? 'page' : undefined}
                        >
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
                {i % 2 === 0 && <Separator className="mt-2" />}
              </SidebarGroup>
            );
          })}
        </nav>

        <Separator className="my-6" />

        <div className="mt-auto px-3 pb-2">
          <Button
            variant="outline"
            className="flex w-full items-center justify-start gap-2 py-5"
            aria-label="Enviar sugestões ou feedback"
            onClick={() => setDialogOpen(true)}
          >
            <MessageSquarePlus size={18} className="text-blue-600" />
            <span className="font-medium">Sugestões</span>
          </Button>
          <FeedbackDialog open={dialogOpen} onClose={setDialogOpen} />
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
