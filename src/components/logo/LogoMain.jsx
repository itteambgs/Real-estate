// material-ui
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// Import your logo
import logo from "/src/assets/images/users/secira_img.jpeg"; // Ensure this file exists

// ==============================|| LOGO COMPONENT ||============================== //

export default function LogoMain() {
  const theme = useTheme();

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {/* Logo */}
      <Box
        component="img"
        src={logo}
        alt="Secira Logo"
        sx={{
          width: 80, // Adjust size
          height: 80,
          borderRadius: "8px", 
        }}
      />


    </Box>
  );
}
