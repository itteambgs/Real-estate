import { IconUserCircle } from '@tabler/icons-react';

const user = {
  id: 'user',
  title: 'User Management',
  type: 'group',
  children: [
    {
      id: 'user',
      title: 'User',
      type: 'item',
      url: '/user',
      icon: IconUserCircle,
      breadcrumbs: false
    }
  ]
};

export default user;
