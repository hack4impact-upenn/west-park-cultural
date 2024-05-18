/**
 * A file for defining the global MUI theme used in the project.
 */
import { createTheme } from '@mui/material/styles';
import 'typeface-hk-grotesk';
import { color, fontFamily, fontSize, fontStyle } from '@mui/system';
import COLORS from './colors';

// https://github.com/hack4impact/chapter-website-template/blob/main/public/style.css
const theme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
      main: COLORS.primaryBlue,
    },
    secondary: {
      main: COLORS.secondarySeafoam,
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
  typography: {
    fontFamily: [
      'HK Grotesk',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Varela Round',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      'sans-serif',
      'Fredoka One',
    ].join(','),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          letterSpacing: '0.3px',
          lineHeight: '1.5',
        },
        h1: {
          fontWeight: 'bold !important',
        },
        h2: {
          fontSize: '50px !important',
          fontFamily: 'Fredoka One',
          fontWeight: 'bold !important',
          marginBottom: '32px !important',
          marginTop: '40px !important',
        },
        h3: {
          fontWeight: 'bold !important',
          marginBottom: '10px',
        },
        h4: {
          fontWeight: 'bold !important',
          fontFamily: 'Varela Round',
          color: '#3B7A2E',
        },
        h5: {
          fontFamily: 'Hind Guntur',
          fontWeight: 'bold !important',
          fontSize: '25px',
          color: COLORS.green,
        },
      },
    },
  },
});

export default theme;
