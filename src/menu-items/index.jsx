// project import
import dashboard from './dashboard';
import pages from './page';
import masterTables from './masterTables';
import role from './role';
import user from './User';  // Ensure this matches the export name

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, pages, masterTables, role, user]
};

export default menuItems;
