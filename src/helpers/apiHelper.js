import axios from 'axios';

// Load Base URL from environment variables or use default
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

// Create an Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ====== Token Management ====== //
const setAuthTokens = (access, refresh) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

const removeAuthTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

const getAccessToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');

// ====== Authentication Endpoints ====== //
export const AUTH_ENDPOINTS = {
  login: `${BASE_URL}/auth/jwt/create/`,
  refresh: `${BASE_URL}/auth/jwt/refresh/`,
  verify: `${BASE_URL}/auth/jwt/verify/`,
  user: `${BASE_URL}/auth/users/me/`,
  changePassword: `${BASE_URL}/auth/users/set_password/`,
};

// ====== Authentication Functions ====== //
export const isAuthenticated = async () => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    await axios.post(AUTH_ENDPOINTS.verify, { token });
    return true;
  } catch (error) {
    console.warn("Token expired, attempting refresh...");
    return !!(await refreshAccessToken());
  }
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    console.warn("No refresh token found, logging out...");
    removeAuthTokens();
    return null;
  }

  try {
    const response = await axios.post(AUTH_ENDPOINTS.refresh, { refresh: refreshToken });
    const newAccessToken = response.data.access;

    setAuthTokens(newAccessToken, refreshToken);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

    return newAccessToken;
  } catch (error) {
    console.error("Token refresh failed:", error.response?.data || error);
    removeAuthTokens();
    return null;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(AUTH_ENDPOINTS.login, { email, password });
    const { access, refresh } = response.data;
    const userResponse = await axios.get(AUTH_ENDPOINTS.user, {
      headers: { Authorization: `Bearer ${access}` },
    });

    setAuthTokens(access, refresh);
    return { success: true, data: userResponse.data };
  } catch (error) {
    console.error('Login Error:', error.response?.data || error);
    return { success: false, error: error.response?.data || 'Login failed' };
  }
};

export const getUserProfile = async () => {
  try {
    const response = await apiClient.get(AUTH_ENDPOINTS.user);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const logoutUser = () => {
  removeAuthTokens();
  window.location.replace('/login');
};

// ====== Password Change ====== //
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await apiClient.post(AUTH_ENDPOINTS.changePassword, {
      current_password: oldPassword,
      new_password: newPassword,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Change password failed:', error.response?.data || error);
    return {
      success: false,
      error: error.response?.data || { detail: 'Password update failed' },
    };
  }
};

// ====== Master Table API Functions ====== //
export const getCountries = async () => {
  try {
    const response = await apiClient.get('/countries/');
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error.response?.data || error.message);
    return [];
  }
};

export const getStates = async () => {
  try {
    const response = await apiClient.get('/states/');
    return response.data;
  } catch (error) {
    console.error('Error fetching states:', error.response?.data || error.message);
    return [];
  }
};

export const getCities = async () => {
  try {
    const response = await apiClient.get('/cities/');
    return response.data;
  } catch (error) {
    console.error('Error fetching cities:', error.response?.data || error.message);
    return [];
  }
};

export const getProperties = async () => {
  try {
    const response = await apiClient.get('/properties/');
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error.response?.data || error.message);
    return [];
  }
};

export const addProperty = async (propertyData) => {
  try {
    const response = await apiClient.post('/properties/', propertyData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error adding property:', error.response?.data || error);
    return { success: false, error: error.response?.data || 'Failed to add property' };
  }
};

export const updateProperty = async (id, propertyData) => {
  try {
    const response = await apiClient.put(`/properties/${id}/`, propertyData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error updating property:', error.response?.data || error);
    return { success: false, error: error.response?.data || 'Failed to update property' };
  }
};

export const deleteProperty = async (id) => {
  try {
    await apiClient.delete(`/properties/${id}/`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting property:', error.response?.data || error);
    return { success: false, error: error.response?.data || 'Failed to delete property' };
  }
};

// Property Type APIs
// Property Type APIs
export const createPropertyType = async (data) => {
  try {
    const response = await apiClient.post('/property-types/', data);
    return response.data;
  } catch (error) {
    console.error('Error creating property type:', error.response?.data || error.message);
    throw error;
  }
};

export const getPropertyType = async () => {
  try {
    const response = await apiClient.get('/property-types/', );
    return response.data;
  } catch (error) {
    console.error('Error creating property type:', error.response?.data || error.message);
    throw error;
  }
};

// export const getPropertyType = async (page = 1, pageSize = 10) => {
//   try {
//     const response = await apiClient.get('/property-types/', {
//       params: {
//         page,
//         page_size: pageSize
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching property types:', error);
//     return { results: [], count: 0 };
//   }
// };

export const deletePropertyType = async (id) => {
  try {
    await apiClient.delete(`/property-types/${id}/`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting Property type :', error);
    return { success: false, error: error.response?.data || 'Failed to delete role' };
  }
};


export const updatePropertyType = async (id, propertyTypeData) => {
  try {
    const response = await apiClient.put(`/property-types/${id}/`, propertyTypeData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error updating property type:', error.response?.data || error);
    return { success: false, error: error.response?.data || 'Failed to update property type' };
  }
};




//Document

export const getdocument = async () => {
  try {
    const response = await apiClient.get('/documents/');
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error.response?.data || error.message);
    return [];
  }
};

//Document types
export const getDocumentTypes = async () => {
  try {
    const response = await apiClient.get('/document-types/');
    return response.data;
  } catch (error) {
    console.error('Error fetching document types:', error.response?.data || error.message);
    return [];
  }
}
//ownership types

export const getownership = async () => {
  try {
    const response = await apiClient.get('/ownership-types/');
    return response.data;
  } catch (error) {
    console.error('Error fetching ownership:', error.response?.data || error.message);
    return [];
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiClient.patch('/auth/users/me/', profileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error updating user profile:', error.response?.data || error);
    return {
      success: false,
      error: error.response?.data || 'Profile update failed',
    };
  }
};





// Role APIs
export const getRoles = async () => {
  try {
    const response = await apiClient.get('/get-roles/');
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
};

export const createRole = async (roleData) => {
  try {
    const response = await apiClient.post('/create-role/', roleData);
    return response.data;
  } catch (error) {
    console.error('Error creating role:', error.response?.data || error.message);
    throw error;
  }
};



export const getRoleById = async (id) => {
  try {
    const response = await apiClient.get(`/edit-role/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching role by ID:', error);
    return null;
  }
};



// Update role API function
export const updateRole = async (id, roleData) => {
  try {
    const response = await apiClient.put(`/edit-role/${id}/`, roleData);
    return response.data;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error; // Make sure errors are thrown to be handled in the calling component
  }
};


// export const editRole = async (id, newName) => {
//   try {
//     const response = await apiClient.put(`/edit-role/${id}/`, { name: newName });
//     return { success: true, data: response.data };
//   } catch (error) {
//     console.error('Error editing role:', error);
//     return { success: false, error: error.response?.data || 'Failed to edit role' };
//   }
// };

export const deleteRole = async (id) => {
  try {
    await apiClient.delete(`/delete-role/${id}/`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting role:', error);
    return { success: false, error: error.response?.data || 'Failed to delete role' };
  }
};

export const assignRoleToUser = async (userId, roleIds) => {
  try {
    const payload = Array.isArray(roleIds)
      ? { role_ids: roleIds }
      : { role_id: roleIds };

    const response = await apiClient.patch(`/assign-role/${userId}/`, payload);
    return response.data;
  } catch (error) {
    console.error('Error assigning role(s):', error);
    return null;
  }
};



export const getUsers = async () => {
  try {
    const response = await apiClient.get('/users/');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// ====== Permissions API ======

export const getPermissions = async () => {
  try {
    const response = await apiClient.get('/get-permissions/');
    return response.data;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return [];
  }
};
//assign permissions to role



export const assignPermissionsToRole = async (roleId, permissionIds) => {
  try {
    const response = await apiClient.post(`/roles/${roleId}/assign-permissions/`, {
      permissions: permissionIds,
    });
    return response.data;
  } catch (error) {
    console.error('Error assigning permissions:', error);
    return null;
  }
};

export const getRolePermissions = async (roleId) => {
  try {
    const response = await apiClient.get(`/roles/${roleId}/permissions/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    return [];
  }
};

export const updateUserRole = async (id, roleData) => {
  try {
    const response = await apiClient.put(`/user-role-update/${id}/`, roleData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error updating user roles:', error.response?.data || error);
    return { success: false, error: error.response?.data || 'Failed to update user roles' };
  }
};

export const deleteUserRoles = async (id) => {
  try {
    const response = await apiClient.delete(`/user-role-delete/${id}/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error deleting user roles:', error.response?.data || error);
    return { success: false, error: error.response?.data || 'Failed to delete user roles' };
  }
};




// ====== Axios Interceptors ====== //
apiClient.interceptors.request.use(
  async (config) => {
    let token = getAccessToken();
    if (!token) {
      token = await refreshAccessToken();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
