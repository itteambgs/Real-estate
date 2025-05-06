// Import Ant Design icons
import { GlobalOutlined, EnvironmentOutlined, HomeOutlined, BankOutlined, FileTextOutlined, TeamOutlined, ApartmentOutlined, FileDoneOutlined } from '@ant-design/icons';

// Store icons in an object
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

// Master Tables menu
const masterTables = {
  id: 'master-tables',
  title: 'Master Tables',
  type: 'group',
  children: [
    {
      id: 'properties',
      title: 'Properties',
      type: 'item',
      url: '/master/properties',
      icon: icons.HomeOutlined,
      breadcrumbs: false
    },
    {
      id: 'document',
      title: 'Document',
      type: 'item',
      url: '/master/document',
      icon: icons.FileTextOutlined,
      breadcrumbs: false
    },
    {
      id: 'countries',
      title: 'Countries',
      type: 'item',
      url: '/master/countries',
      icon: icons.GlobalOutlined ,
      breadcrumbs: false
    },
    {
      id: 'states',
      title: 'States',
      type: 'item',
      url: '/master/states',
      icon: icons.EnvironmentOutlined,
      breadcrumbs: false
    },
    {
      id: 'cities',
      title: 'Cities',
      type: 'item',
      url: '/master/cities',
      icon: icons.BankOutlined,
      breadcrumbs: false
    },
    {
      id: 'ownership-type',
      title: 'Ownership Type',
      type: 'item',
      url: '/master/ownership-type',
      icon: icons.TeamOutlined,
      breadcrumbs: false
    },
    {
      id: 'bhk-type',
      title: 'BHK Type',
      type: 'item',
      url: '/master/bhk-type',
      icon: icons.ApartmentOutlined,
      breadcrumbs: false
    },
    {
      id: 'property-type',
      title: 'Property Type',
      type: 'item',
      url: '/master/property-type/',
      icon: icons.FileDoneOutlined,
      breadcrumbs: false
    },
    {
      id: 'document-type',
      title: 'Document Type',
      type: 'item',
      url: '/master/document-type',
      icon: icons.FileTextOutlined,
      breadcrumbs: false
    },





  ]
};

export default masterTables;
