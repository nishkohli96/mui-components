'use client';

import { useEffect, useState } from 'react';
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

const containsPath = (page: Page, pathname: string): boolean =>
  page.href === pathname || page.pages?.some(child => containsPath(child, pathname)) === true;

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

  useEffect(() => {
    if (containsActivePage) {
      setOpen(true);
    }
  }, [containsActivePage]);

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
                fontSize: '0.9rem',
                fontWeight: isActive || (hasChildren && containsActivePage) ? 600 : 400
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
 * Highlights the current route.
 */
const Drawer = ({ onNavigate }: DrawerProps) => {
  const pathname = usePathname();

  return (
    <List dense sx={{ px: 1 }}>
      {sidebarLinks.map(link => (
        <SidebarItem key={link.href ?? link.title} page={link} pathname={pathname} onNavigate={onNavigate} />
      ))}
    </List>
  );
};

export default Drawer;
