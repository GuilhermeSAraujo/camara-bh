import React, { useEffect } from 'react';
import { useSidebar } from '../../components/ui/Sidebar';

export function Home() {
  const { setOpen } = useSidebar();

  useEffect(() => {
    setOpen(false);
  }, []);

  return <h1>HOME</h1>;
}
