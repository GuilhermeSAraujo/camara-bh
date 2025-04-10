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
} from './Sidebar';

// This is sample data.
const data = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  navMain: [
    {
      title: 'Projetos de Lei',
      url: '#',
      ariaLabel: 'Menu de projetos de lei',
      items: [
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
      title: 'Building Your Application',
      url: '#',
      ariaLabel: 'Menu de construção da aplicação',
      items: [
        {
          title: 'Vereadores',
          url: RoutePaths.VEREADORES,
          ariaLabel: 'Ver informações sobre vereadores',
        },
      ],
    },
    {
      title: 'API Reference',
      url: '#',
      ariaLabel: 'Menu de referência da API',
      items: [
        {
          title: 'Components',
          url: '#',
          ariaLabel: 'Ver documentação de componentes',
        },
      ],
    },
  ],
};

export function AppSidebar({ setBreadcrumb, ...props }) {
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleItemClick = ({ group, title, url }) => {
    setBreadcrumb({ group, title });
    navigate(url);

    const updatedNavItems = navItems.map((navGroup) => ({
      ...navGroup,
      items: navGroup.items.map((item) => ({
        ...item,
        isActive: item.title === title,
      })),
    }));

    setNavItems(updatedNavItems);
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
