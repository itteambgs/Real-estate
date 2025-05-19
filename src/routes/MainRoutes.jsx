import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import CreateProperty from 'pages/master/property/CreateProperty'; 

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render - color
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// master tables
// Import master table pages
const Countries = Loadable(lazy(() => import('pages/master/Countries')));
const States = Loadable(lazy(() => import('pages/master/States')));
const Cities = Loadable(lazy(() => import('pages/master/Cities')));
const Properties = Loadable(lazy(() => import('pages/master/property/Properties')));
// const addProperties = Loadable(lazy(() => import('pages/master/property/CreateProperty'))); // Already imported CreateProperty
const Document = Loadable(lazy(() => import('pages/master/Document')));
const OwnershipType = Loadable(lazy(() => import('pages/master/OwnershipType')));
const BHKType = Loadable(lazy(() => import('pages/master/BHKType')));

const PropertyType = Loadable(lazy(() => import('pages/master/property type/PropertyType')));
const CreateProptype=Loadable(lazy(() => import(('pages/master/property type/CreateProptype'))));
const EditProptype=Loadable(lazy(() => import(('pages/master/property type/EditProptype'))));
const ReadProptype=Loadable(lazy(() => import(('pages/master/property type/Readproptype')))); 

const DocumentType = Loadable(lazy(() => import('pages/master/DocumentType')));

const Profile = Loadable(lazy(() => import('@/layout/Dashboard/Header/HeaderContent/Profile')));
const EditProfile = Loadable(lazy(() => import('@/layout/Dashboard/Header/HeaderContent/Profile/EditProfile')));

const RolePage = Loadable(lazy(() => import('pages/role')));
const CreateRolePage = Loadable(lazy(() => import('pages/role/CreateRolePage')));

const EditRolePage = Loadable(lazy(() => import('pages/role/EditRolePage')));

const IndexUser = Loadable(lazy(() => import('pages/User/IndexUser')));

const AddUser = Loadable(lazy(() => import('pages/user/AddUser')));
const EditUser = Loadable(lazy(() => import('pages/user/EditUser')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <ProtectedRoute />, 
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: '/',
          element: <DashboardDefault />
        },
        {
          path: 'dashboard',
          children: [
            {
              path: 'default',
              element: <DashboardDefault />
            }
          ]
        },
        {
          path: 'typography',
          element: <Typography />
        },
        {
          path: 'color',
          element: <Color />
        },
        {
          path: 'shadow',
          element: <Shadow />
        },
        {
          path: 'sample-page',
          element: <SamplePage />
        },
        { path: 'master/countries', element: <Countries /> },
        { path: 'master/states', element: <States /> },
        { path: 'master/cities', element: <Cities /> },
        { path: 'master/properties', element: <Properties /> },
        { path: 'master/properties/add-properties', element: <CreateProperty /> },  // Add Property
        { path: 'master/properties/edit-properties/:id', element: <CreateProperty /> },  // Edit Property (assuming same component as CreateProperty for editing)
        { path: 'master/document', element: <Document /> },
        { path: 'master/ownership-type', element: <OwnershipType /> },
        { path: 'master/bhk-type', element: <BHKType /> },
        { path: 'master/property-type/create', element: <CreateProptype /> },
        { path: 'master/property-type/edit/:id', element: <EditProptype /> },
        { path: 'master/property-type/', element: <ReadProptype /> },
        { path: 'master/document-type', element: <DocumentType /> },
        {
          path: 'profile',
          element: <Profile />
        },
        {
          path: 'edit-profile',
          element: <EditProfile />
        },
        {
          path: 'roles', 
          element: <RolePage />
        },
        {
          path: 'role/create',
          element: <CreateRolePage />
        },
        {
          path: 'role/edit/:id',
          element: <EditRolePage />
        },
        {
          path: 'user-role',
          element: <IndexUser />
        },
        {
          path: 'add-user',
          element: <AddUser />
        },
        {
          path: 'edit-user/:id',
          element: <EditUser />
        }
      ]
    }
  ]
};

export default MainRoutes;
