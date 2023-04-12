
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';


export const TreeButton = styled(Button)({
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 16,
  padding: '6px 12px',
  border: '1px solid',
  lineHeight: 1.5,
  height : "5vh",
  color : "#736F71",


  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  '&:hover': {
    backgroundColor: '#b2cbd6',
    borderColor: "#736F71",
   
  },
  '&:active': {

    backgroundColor: '#b2cbd6'
    
  },
  '&:focus': {
   
    backgroundColor: '#b2cbd6'
  },
});
