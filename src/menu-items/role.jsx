import { IconUsers } from '@tabler/icons-react';

const allRoleItems = [
  {
    id: 'role',
    title: 'Role',
    type: 'item',
    url: '/roles',
    icon: IconUsers,
    breadcrumbs: false,
    permission: [
      'view_group',
      'add_group',
      'change_group',
      'delete_group'
    ]
  }
];

const role = (permissions = []) => {
  const children = allRoleItems.filter((item) => {
    if (!item.permission) return true;

    const perms = Array.isArray(item.permission) ? item.permission : [item.permission];
    return perms.some((perm) => permissions.includes(perm));
  });

  return {
    id: 'role-group',
    title: 'Role Management',
    type: 'group',
    children
  };
};

export default role;
