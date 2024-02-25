import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import {
  Typography,
  Grid,
  TextField,
  SelectChangeEvent,
  MenuItem,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Dayjs } from 'dayjs';
import FormControl from '@mui/material/FormControl';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box } from '@mui/system';

/**
 The New Donation Page
 */

const filter = createFilterOptions<FilmOptionType>();

function NewDonationPage() {
  const [donationType, setDonationType] = useState<string | null>('donation');

  const [grantYear, setGrantYear] = useState('');

  const [donationAmount, setDonationAmount] = useState('');
  const [donationDate, setDonationDate] = useState<Dayjs | null>(null);

  const [donator, setDonator] = useState<FilmOptionType | null>(null);

  const [isNewDonator, setIsNewDonator] = useState(false);
  const [newDonatorEmail, setNewDonatorEmail] = useState('');
  const [newDonatorAddress, setNewDonatorAddress] = useState('');
  const [newDonatorGroup, setNewDonatorGroup] = useState('');

  const [campaignPurpose, setCampaignPurpose] = useState<FilmOptionType | null>(
    null,
  );

  const [notes, setNotes] = useState('');

  const [paymentType, setPaymentType] = useState('');

  const handleDonationType = (
    event: React.MouseEvent<HTMLElement>,
    newDonationType: string | null,
  ) => {
    setDonationType(newDonationType);
  };

  const handleDonationAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setDonationAmount(event.target.value);
  };

  const handleNewDonatorEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewDonatorEmail(event.target.value);
  };

  const handleNewDonatorAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewDonatorAddress(event.target.value);
  };

  const handleNewDonatorGroupChange = (event: SelectChangeEvent) => {
    setNewDonatorGroup(event.target.value);
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };

  const handlePaymentTypeChange = (event: SelectChangeEvent) => {
    setPaymentType(event.target.value);
  };

  return (
    <Grid container sx={{ m: 3 }} spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
          Register New Donation
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ width: '50%' }}>
          <ToggleButtonGroup
            value={donationType}
            exclusive
            onChange={handleDonationType}
            aria-label="donation type"
            size="large"
            fullWidth
          >
            <ToggleButton value="donation" aria-label="donation">
              Donation
            </ToggleButton>
            <ToggleButton value="sponsorship" aria-label="sponsorship">
              Sponsorship
            </ToggleButton>
            <ToggleButton value="grant" aria-label="grant">
              Grant
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Grid>
      {donationType === 'grant' && (
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel required={donationType === 'grant'}>
              Grant Year
            </InputLabel>
            <Select
              value={grantYear}
              label="Grant Year"
              onChange={(event) => setGrantYear(event.target.value)}
              required={donationType === 'grant'}
            >
              <MenuItem value="multi-year">Multi-Year</MenuItem>
              <MenuItem value="single-year">Single-Year</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      )}
      <Grid item xs={12}>
        <TextField
          id="outlined-number"
          label="Donation Amount"
          type="number"
          value={donationAmount}
          onChange={handleDonationAmountChange}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={donationDate}
            onChange={(newDonationDate) => setDonationDate(newDonationDate)}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          value={donator}
          onChange={(event, newValue) => {
            setIsNewDonator(false);
            if (typeof newValue === 'string') {
              setDonator({
                title: newValue,
              });
            } else if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              setIsNewDonator(true);
              setDonator({
                title: newValue.inputValue,
              });
            } else {
              setDonator(newValue);
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some(
              (option) => inputValue === option.title,
            );
            if (inputValue !== '' && !isExisting) {
              filtered.push({
                inputValue,
                title: `Add "${inputValue}"`,
              });
            }

            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="donator-picker"
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          options={top100Films}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === 'string') {
              return option;
            }
            // Add "xxx" option created dynamically
            if (option.inputValue) {
              return option.inputValue;
            }
            // Regular option
            return option.title;
          }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          renderOption={(props, option) => <li {...props}>{option.title}</li>}
          sx={{ width: 300 }}
          freeSolo
          renderInput={(params) => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              label="Donator"
              required
              helperText="Search for a previous donater. If they are a new donater, a profile will be created automatically. All donaters must have unique names."
            />
          )}
        />
      </Grid>
      {isNewDonator && (
        <Grid item xs={12}>
          <TextField
            label="New Donator Email"
            type="email"
            value={newDonatorEmail}
            onChange={handleNewDonatorEmailChange}
            required={isNewDonator}
          />
        </Grid>
      )}
      {isNewDonator && (
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel required={isNewDonator}>New Donator Group</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={newDonatorGroup}
              label="New Donator Group"
              onChange={handleNewDonatorGroupChange}
              required={isNewDonator}
            >
              <MenuItem value="Individual">Individual</MenuItem>
              <MenuItem value="Board Member">Board Member</MenuItem>
              <MenuItem value="Foundation">Foundation</MenuItem>
              <MenuItem value="Corporate">Corporate</MenuItem>
              <MenuItem value="Gov/State">Gov/State</MenuItem>
              <MenuItem value="Gov/Fed">Gov/Fed</MenuItem>
              <MenuItem value="Gov/Municipal">Gov/Municipal</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      )}
      {isNewDonator && (
        <Grid item xs={12}>
          <TextField
            label="New Donator Address"
            type="text"
            value={newDonatorAddress}
            onChange={handleNewDonatorAddressChange}
          />
        </Grid>
      )}

      <Grid item xs={12}>
        <Autocomplete
          value={campaignPurpose}
          onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
              setCampaignPurpose({
                title: newValue,
              });
            } else if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              setCampaignPurpose({
                title: newValue.inputValue,
              });
            } else {
              setCampaignPurpose(newValue);
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some(
              (option) => inputValue === option.title,
            );
            if (inputValue !== '' && !isExisting) {
              filtered.push({
                inputValue,
                title: `Add "${inputValue}"`,
              });
            }

            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="free-solo-with-text-demo"
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          options={top100Films}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === 'string') {
              return option;
            }
            // Add "xxx" option created dynamically
            if (option.inputValue) {
              return option.inputValue;
            }
            // Regular option
            return option.title;
          }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          renderOption={(props, option) => <li {...props}>{option.title}</li>}
          sx={{ width: 300 }}
          freeSolo
          renderInput={(params) => (
            <TextField
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              label="Campaign / Purpose"
              required
              helperText="
              Search for a campaign / purpose that already has donations, or type a
          new campaign. All campaigns must have unique names."
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Notes"
          type="text"
          value={notes}
          onChange={handleNotesChange}
          multiline
        />
      </Grid>
      <Grid item xs={2}>
        <FormControl fullWidth>
          <InputLabel>Payment Type</InputLabel>
          <Select
            value={paymentType}
            label="Payment Type"
            onChange={handlePaymentTypeChange}
          >
            <MenuItem value="Mail Check">Mail Check</MenuItem>
            <MenuItem value="Credit">Credit</MenuItem>
            <MenuItem value="Paypal">Paypal</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          onClick={() => {
            alert('clicked');
          }}
        >
          Register Donation
        </Button>
        <FormHelperText>Donation ID: #####</FormHelperText>
      </Grid>
    </Grid>
  );
}

export default NewDonationPage;

interface FilmOptionType {
  inputValue?: string;
  title: string;
  year?: number;
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films: readonly FilmOptionType[] = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  {
    title: 'The Lord of the Rings: The Two Towers',
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  {
    title: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
  },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
  { title: 'Casablanca', year: 1942 },
  { title: 'City Lights', year: 1931 },
  { title: 'Psycho', year: 1960 },
  { title: 'The Green Mile', year: 1999 },
  { title: 'The Intouchables', year: 2011 },
  { title: 'Modern Times', year: 1936 },
  { title: 'Raiders of the Lost Ark', year: 1981 },
  { title: 'Rear Window', year: 1954 },
  { title: 'The Pianist', year: 2002 },
  { title: 'The Departed', year: 2006 },
  { title: 'Terminator 2: Judgment Day', year: 1991 },
  { title: 'Back to the Future', year: 1985 },
  { title: 'Whiplash', year: 2014 },
  { title: 'Gladiator', year: 2000 },
  { title: 'Memento', year: 2000 },
  { title: 'The Prestige', year: 2006 },
  { title: 'The Lion King', year: 1994 },
  { title: 'Apocalypse Now', year: 1979 },
  { title: 'Alien', year: 1979 },
  { title: 'Sunset Boulevard', year: 1950 },
  {
    title:
      'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    year: 1964,
  },
  { title: 'The Great Dictator', year: 1940 },
  { title: 'Cinema Paradiso', year: 1988 },
  { title: 'The Lives of Others', year: 2006 },
  { title: 'Grave of the Fireflies', year: 1988 },
  { title: 'Paths of Glory', year: 1957 },
  { title: 'Django Unchained', year: 2012 },
  { title: 'The Shining', year: 1980 },
  { title: 'WALL·E', year: 2008 },
  { title: 'American Beauty', year: 1999 },
  { title: 'The Dark Knight Rises', year: 2012 },
  { title: 'Princess Mononoke', year: 1997 },
  { title: 'Aliens', year: 1986 },
  { title: 'Oldboy', year: 2003 },
  { title: 'Once Upon a Time in America', year: 1984 },
  { title: 'Witness for the Prosecution', year: 1957 },
  { title: 'Das Boot', year: 1981 },
  { title: 'Citizen Kane', year: 1941 },
  { title: 'North by Northwest', year: 1959 },
  { title: 'Vertigo', year: 1958 },
  {
    title: 'Star Wars: Episode VI - Return of the Jedi',
    year: 1983,
  },
  { title: 'Reservoir Dogs', year: 1992 },
  { title: 'Braveheart', year: 1995 },
  { title: 'M', year: 1931 },
  { title: 'Requiem for a Dream', year: 2000 },
  { title: 'Amélie', year: 2001 },
  { title: 'A Clockwork Orange', year: 1971 },
  { title: 'Like Stars on Earth', year: 2007 },
  { title: 'Taxi Driver', year: 1976 },
  { title: 'Lawrence of Arabia', year: 1962 },
  { title: 'Double Indemnity', year: 1944 },
  {
    title: 'Eternal Sunshine of the Spotless Mind',
    year: 2004,
  },
  { title: 'Amadeus', year: 1984 },
  { title: 'To Kill a Mockingbird', year: 1962 },
  { title: 'Toy Story 3', year: 2010 },
  { title: 'Logan', year: 2017 },
  { title: 'Full Metal Jacket', year: 1987 },
  { title: 'Dangal', year: 2016 },
  { title: 'The Sting', year: 1973 },
  { title: '2001: A Space Odyssey', year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: 'Toy Story', year: 1995 },
  { title: 'Bicycle Thieves', year: 1948 },
  { title: 'The Kid', year: 1921 },
  { title: 'Inglourious Basterds', year: 2009 },
  { title: 'Snatch', year: 2000 },
  { title: '3 Idiots', year: 2009 },
  { title: 'Monty Python and the Holy Grail', year: 1975 },
];
