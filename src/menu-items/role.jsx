import { IconUsers } from '@tabler/icons-react';

const role = {
  id: 'role-group',
  title: 'Role Management',
  type: 'group',
  children: [
    {
      id: 'role',
      title: 'Role',
      type: 'item',
      url: '/role',
      icon: IconUsers,
      breadcrumbs: false
    }
  ]
};

export default role;
