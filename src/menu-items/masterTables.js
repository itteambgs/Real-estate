import {
  GlobalOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  BankOutlined,
  FileTextOutlined,
  TeamOutlined,
  ApartmentOutlined,
  FileDoneOutlined
} from '@ant-design/icons';

const icons = {
  GlobalOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  BankOutlined,
  FileTextOutlined,
  TeamOutlined,
  ApartmentOutlined,
  FileDoneOutlined
};

const allItems = [
  {
    id: 'properties',
    title: 'Properties',
    type: 'item',
    url: '/master/properties',
    icon: icons.HomeOutlined,
    breadcrumbs: false,
    permission: [
      'view_property',
      'add_property',
      'change_property',
      'delete_property'
    ]
  },
  {
    id: 'countries',
    title: 'Countries',
    type: 'item',
    url: '/master/countries',
    icon: icons.GlobalOutlined,
    breadcrumbs: false,
    permission: [
      'view_country',
      'add_country',
      'change_country',
      'delete_country'
    ]
  },
  {
    id: 'states',
    title: 'States',
    type: 'item',
    url: '/master/states',
    icon: icons.EnvironmentOutlined,
    breadcrumbs: false,
    permission: ['view_state', 'add_state', 'change_state', 'delete_state']
  },
  {
    id: 'cities',
    title: 'Cities',
    type: 'item',
    url: '/master/cities',
    icon: icons.BankOutlined,
    breadcrumbs: false,
    permission: ['view_city', 'add_city', 'change_city', 'delete_city']
  },
  {
    id: 'ownership-type',
    title: 'Ownership Type',
    type: 'item',
    url: '/master/ownership-type',
    icon: icons.TeamOutlined,
    breadcrumbs: false,
    permission: [
      'view_ownershiptype',
      'add_ownershiptype',
      'change_ownershiptype',
      'delete_ownershiptype'
    ]
  },
  {
    id: 'bhk-type',
    title: 'BHK Type',
    type: 'item',
    url: '/master/bhk-type',
    icon: icons.ApartmentOutlined,
    breadcrumbs: false,
    permission: [
      'view_bhktype',
      'add_bhktype',
      'change_bhktype',
      'delete_bhktype'
    ]
  },
  {
    id: 'property-type',
    title: 'Property Type',
    type: 'item',
    url: '/master/property-type/',
    icon: icons.FileDoneOutlined,
    breadcrumbs: false,
    permission: [
      'view_propertytype',
      'add_propertytype',
      'change_propertytype',
      'delete_propertytype'
    ]
  },
  {
    id: 'document-type',
    title: 'Document Type',
    type: 'item',
    url: '/master/document-type',
    icon: icons.FileTextOutlined,
    breadcrumbs: false,
    permission: [
      'view_documenttype',
      'add_documenttype',
      'change_documenttype',
      'delete_documenttype'
    ]
  }
];

const masterTables = (permissions = []) => {
  const children = allItems.filter((item) => {
    if (!item.permission) return true;

    const perms = Array.isArray(item.permission) ? item.permission : [item.permission];
    return perms.some((perm) => permissions.includes(perm));
  });

  return {
    id: 'master-tables',
    title: 'Master Tables',
    type: 'group',
    children
  };
};

export default masterTables;
