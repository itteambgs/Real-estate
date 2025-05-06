import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  MenuItem,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '@/Helpers/apiHelper';

export default function EditProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip_code: '',
    date_of_birth: '',
    gender: '',
    profile_picture: '',
    username: '',
    password: '',
  });

  const [profileImagePreview, setProfileImagePreview] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getUserProfile();
        if (profile) {
          setFormData((prev) => ({
            ...prev,
            ...Object.fromEntries(
              Object.entries(profile).map(([k, v]) => [k, v ?? ''])
            ),
            password: '',
          }));
          setProfileImagePreview(profile.profile_picture || null);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profile_picture: file,
      }));
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'password' && value === '') return;
      if (key === 'profile_picture' && typeof value === 'string') return;
      if (value !== undefined && value !== null) {
        data.append(key, value);
      }
    });

    if (!formData.last_name) {
      data.set('last_name', ' ');
    }

    try {
      const response = await updateUserProfile(data);
      if (response.success) {
        console.log('Profile updated successfully!');
        // Optional: Navigate or show a success message
      } else {
        alert('Failed to update profile:\n' + JSON.stringify(response.error, null, 2));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" gutterBottom>Edit Profile</Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={2}>
          <Avatar src={profileImagePreview} sx={{ width: 80, height: 80 }} />
        </Grid>
        <Grid item xs={12} sm={10}>
          <Typography variant="h6">
            {formData.first_name} {formData.last_name}
          </Typography>
          <Typography>ID: {formData.id ?? 'N/A'}</Typography>
          <Button
            variant="outlined"
            sx={{ mt: 1 }}
            onClick={() => navigate('/change-password')}
          >
            Change Password
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" component="label">
            Upload Profile Picture
            <input hidden type="file" accept="image/*" onChange={handleImageChange} />
          </Button>
        </Grid>

        {[
          { label: 'First Name', name: 'first_name' },
          { label: 'Last Name', name: 'last_name' },
          { label: 'Phone Number', name: 'phone_number' },
          { label: 'Email', name: 'email' },
          { label: 'Username', name: 'username' },
          { label: 'Date of Birth', name: 'date_of_birth', type: 'date' },
          { label: 'Address', name: 'address' },
          { label: 'City', name: 'city' },
          { label: 'State', name: 'state' },
          { label: 'Country', name: 'country' },
          { label: 'Zip Code', name: 'zip_code' },
        ].map((field) => (
          <Grid key={field.name} item xs={12} sm={6}>
            <TextField
              fullWidth
              label={field.label}
              name={field.name}
              type={field.type || 'text'}
              value={formData[field.name] ?? ''}
              InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
              onChange={handleChange}
            />
          </Grid>
        ))}

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Gender"
            name="gender"
            value={formData.gender ?? ''}
            onChange={handleChange}
          >
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
