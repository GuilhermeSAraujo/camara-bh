import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      items: [
        {
          title: 'Por Vereadores',
          url: RoutePaths.PROJETOS_DE_LEI,
        },
        {
          title: 'Por Partidos',
          url: RoutePaths.PROJETOS_DE_LEI_POR_PARTIDOS,
        },
      ],
    },
    {
      title: 'Building Your Application',
      url: '#',
      items: [
        {
          title: 'Vereadores',
          url: RoutePaths.VEREADORES,
        },
      ],
    },
    {
      title: 'API Reference',
      url: '#',
      items: [
        {
          title: 'Components',
          url: '#',
        },
      ],
    },
  ],
};

export function AppSidebar({ setBreadcrumb, ...props }) {
  const [navItems, setNavItems] = useState(data.navMain); // Add state for nav items
  const navigate = useNavigate(); // Initialize useNavigate

  const handleItemClick = ({ group, title, url }) => {
    setBreadcrumb({ group, title });
    navigate(url); // Navigate to the corresponding URL

    // Update isActive state
    const updatedNavItems = navItems.map((group) => ({
      ...group,
      items: group.items.map((item) => ({
        ...item,
        isActive: item.title === title, // Set isActive for clicked item
      })),
    }));

    setNavItems(updatedNavItems); // Update state with new nav items
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <NavBarCaption handleItemClick={handleItemClick} />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {navItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.isActive}
                      onClick={() =>
                        handleItemClick({
                          group: group.title,
                          title: item.title,
                          url: item.url,
                        })
                      }
                    >
                      <p>{item.title}</p>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
