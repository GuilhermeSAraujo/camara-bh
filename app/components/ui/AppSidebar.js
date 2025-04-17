import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RoutePaths } from '../../general/RoutePaths';
import { NavBarCaption } from './NavBarCaption';
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

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Projetos de Lei',
      url: '#',
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
      url: '#',
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
  const { setOpen } = useSidebar();

  // Initialize with current path active
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

  // Toggle group expansion
  const toggleGroup = (groupTitle) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupTitle]: !prev[groupTitle],
    }));
  };

  // Modificação para o AppSidebar.jsx
  const handleItemClick = ({ group, title, url }) => {
    // Encontre a URL do grupo
    const groupData = navItems.find((navGroup) => navGroup.title === group);
    const groupUrl = groupData ? groupData.url : '/';

    setBreadcrumb({
      group,
      title,
      groupUrl,
      itemUrl: url,
    });

    navigate(url);

    const updatedNavItems = navItems.map((navGroup) => ({
      ...navGroup,
      items: navGroup.items.map((item) => ({
        ...item,
        isActive: item.title === title,
      })),
    }));

    setNavItems(updatedNavItems);

    setOpen(false);
    // Scroll to top
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
      <SidebarContent>
        <nav aria-label="Menu de navegação principal">
          {navItems.map((group) => {
            const isExpanded = expandedGroups[group.title] !== false; // Default to expanded if not set
            const groupId = `group-${group.title.replace(/\s+/g, '-').toLowerCase()}`;
            const menuId = `menu-${group.title.replace(/\s+/g, '-').toLowerCase()}`;

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
              </SidebarGroup>
            );
          })}
        </nav>
      </SidebarContent>
      <SidebarRail aria-hidden="true" />
    </Sidebar>
  );
}
