import { useState } from 'react'

export default function useSidenav() {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    const handleToggleSidebar = () => {
      setIsSidebarExpanded(!isSidebarExpanded);
    };
  return {
    isSidebarExpanded, handleToggleSidebar
  }
}
