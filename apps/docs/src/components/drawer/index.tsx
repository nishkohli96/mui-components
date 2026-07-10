'use client';

import { usePathname } from 'next/navigation';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { sidebarLinks } from '@/constants';

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
      {sidebarLinks.map(link => {
        const isActive = pathname === (link.href || '/');
        return (
          <ListItem key={link.href.replace('/', '') || 'home'} disablePadding>
            <ListItemButton
              href={`${link.href}`}
              onClick={onNavigate}
              selected={isActive}
              sx={{
                borderRadius: 2,
                my: 0.25,
                '&.Mui-selected': {
                  color: 'primary.main',
                  bgcolor: 'action.selected'
                },
                '&.Mui-selected:hover': {
                  bgcolor: 'action.selected'
                }
              }}
            >
              <ListItemText
                slotProps={{
                  primary: {
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 400
                  }
                }}
              >
                {link.title}
              </ListItemText>
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default Drawer;
