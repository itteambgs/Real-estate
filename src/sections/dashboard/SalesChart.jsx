import { useState } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { BarChart } from '@mui/x-charts/BarChart';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| SALES COLUMN CHART ||============================== //

export default function SalesChart() {
  const theme = useTheme();

  const [showIncome, setShowIncome] = useState(true);
  const [showCostOfSales, setShowCostOfSales] = useState(true);

  const handleIncomeChange = () => {
    setShowIncome(!showIncome);
  };

  const handleCostOfSalesChange = () => {
    setShowCostOfSales(!showCostOfSales);
  };

  const valueFormatter = (value) => `$ ${value} Thousands`;
  const primaryColor = theme.palette.primary.main;
  const warningColor = theme.palette.warning.main;

  const lables = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = [
    { data: [180, 90, 135, 114, 120, 145, 170, 200, 170, 230, 210, 180], label: 'Income', color: warningColor, valueFormatter },
    { data: [120, 45, 78, 150, 168, 99, 180, 220, 180, 210, 220, 200], label: 'Cost of Sales', color: primaryColor, valueFormatter }
  ];

  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };

  return (
<h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur dolorum voluptatem vel explicabo dicta facere odio! Doloremque debitis velit ducimus amet corporis. Voluptatem quidem, incidunt eveniet repellat consectetur saepe repudiandae.</h1>
  );
}
