import { IconUserCircle } from '@tabler/icons-react';

const allUserItems = [
  {
    id: 'user',
    title: 'User',
    type: 'item',
    url: '/user-role',
    icon: IconUserCircle,
    breadcrumbs: false,
    permission: [
      'view_customuser',
      'add_customuser',
      'change_customuser',
      'delete_customuser'
    ]
  }
];

const user = (permissions = []) => {
  const children = allUserItems.filter((item) => {
    if (!item.permission) return true;

    const perms = Array.isArray(item.permission) ? item.permission : [item.permission];
    return perms.some((perm) => permissions.includes(perm));
  });

  return {
    id: 'user',
    title: 'User Management',
    type: 'group',
    children
  };
};

export default user;
