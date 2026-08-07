'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { sidebarLinks } from '@/constants';
import { type Page } from '@/types';

const containsPath = (page: Page, pathname: string): boolean => {
  return (
    page.href === pathname
    || page.pages?.some(child => containsPath(child, pathname)) === true
  );
};

type SidebarItemProps = DrawerProps & {
  page: Page;
  pathname: string;
  depth?: number;
};

const SidebarItem = ({ page, pathname, onNavigate, depth = 0 }: SidebarItemProps) => {
  const hasChildren = Boolean(page.pages?.length);
  const containsActivePage = containsPath(page, pathname);
  const isActive = page.href === pathname;
  const [open, setOpen] = useState(containsActivePage);

  /**
   * Auto-expand when this branch newly contains the active page (e.g.
   * client-side nav into a collapsed section). Adjusting state during
   * render — tracking the previous value — is React's recommended
   * alternative to a setState-in-effect and avoids an extra paint.
   */
  const [wasActive, setWasActive] = useState(containsActivePage);
  if (containsActivePage !== wasActive) {
    setWasActive(containsActivePage);
    if (containsActivePage) {
      setOpen(true);
    }
  }

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          {...(!hasChildren && page.href ? { href: page.href } : {})}
          onClick={hasChildren ? () => setOpen(value => !value) : onNavigate}
          selected={isActive}
          aria-expanded={hasChildren ? open : undefined}
          sx={{
            borderRadius: 2,
            my: 0.25,
            pl: 2 + depth * 2,
            '&.Mui-selected': { color: 'primary.main', bgcolor: 'action.selected' },
            '&.Mui-selected:hover': { bgcolor: 'action.selected' }
          }}
        >
          <ListItemText
            slotProps={{
              primary: {
                sx: {
                  fontSize: '0.9rem',
                  fontWeight: isActive || (hasChildren && containsActivePage) ? 600 : 400
                }
              }
            }}
          >
            {page.title}
          </ListItemText>
          {hasChildren && (open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />)}
        </ListItemButton>
      </ListItem>
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" dense disablePadding>
            {page.pages?.map(child => (
              <SidebarItem
                key={child.href ?? child.title}
                page={child}
                pathname={pathname}
                onNavigate={onNavigate}
                depth={depth + 1}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

type DrawerProps = {
  /** Called after a link is clicked, e.g. to close the mobile drawer. */
  onNavigate?: () => void;
};

/**
 * Side-navigation list shared by the desktop rail and the mobile drawer.
 * Highlights the current route and, on navigation, scrolls the active item
 * into view within the rail's own scroll area — otherwise landing on a deep
 * item (e.g. Rating) leaves the rail scrolled to the top with the highlight
 * off-screen.
 */
const Drawer = ({ onNavigate }: DrawerProps) => {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('.Mui-selected');
    if (!list || !active) {
      return;
    }

    /**
     * Nearest scrollable ancestor — the desktop rail's overflow box or the
     * mobile drawer paper. Scroll only this element, never the window.
     */
    let container: HTMLElement | null = list.parentElement;
    while (container) {
      const { overflowY } = getComputedStyle(container);
      if (overflowY === 'auto' || overflowY === 'scroll') {
        break;
      }
      container = container.parentElement;
    }
    if (!container) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const fullyVisible
      = activeRect.top >= containerRect.top
        && activeRect.bottom <= containerRect.bottom;
    if (fullyVisible) {
      return;
    }

    /* Center the active item in the rail's viewport. */
    container.scrollTop
      += (activeRect.top - containerRect.top)
        - (container.clientHeight - activeRect.height) / 2;
  }, [pathname]);

  return (
    <List dense sx={{ px: 1 }} ref={listRef}>
      {sidebarLinks.map(link => (
        <SidebarItem
          key={link.href ?? link.title}
          page={link}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      ))}
    </List>
  );
};

export default Drawer;
