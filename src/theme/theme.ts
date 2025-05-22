// MUI 기본 테마 설정
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4E02B2',
    },
    secondary: {
      main: '#6103B0',
      light:'#F5F3FF'
    },
    info: {
      main: '#7C59C3', 
      light:"#5417D6",
      dark:"#FAFAFA"
    },
   
  },
});

export default theme;
