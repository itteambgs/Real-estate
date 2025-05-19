import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import NavGroup from './NavGroup';
import { getUserInfo } from 'helpers/apiHelper';

// Menu imports
import dashboard from 'menu-items/dashboard'; // Always visible
import masterTables from 'menu-items/masterTables';
import rawUser from 'menu-items/user';
import rawRole from 'menu-items/role';

export default function Navigation() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const permissions = await getUserInfo(); // e.g. ['view_user', 'add_user', ...]

        const filterByPermissions = (group) => {
          return {
            ...group,
            children: group.children.filter(
              (item) =>
                !item.permission || item.permission.some((perm) => permissions.includes(perm))
            )
          };
        };

        const items = [
          dashboard, // ✅ Always visible, no permissions
          masterTables(permissions), // ✅ Filtered inside the file
          filterByPermissions(rawUser(permissions)),
          filterByPermissions(rawRole(permissions))
        ];

        // ✅ Fix: Allow items without children (like dashboard)
        const filteredItems = items.filter(
          (item) => item.type !== 'group' || (item.children && item.children.length > 0)
        );

        setMenuItems(filteredItems);
      } catch (error) {
        console.error('Error loading menu:', error);
      }
    };

    loadMenu();
  }, []);

  const navGroups = menuItems.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      case 'item':
        return <NavGroup key={item.id} item={{ ...item, children: [item] }} />; // wrap in a group-like structure
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Unknown menu type
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}
