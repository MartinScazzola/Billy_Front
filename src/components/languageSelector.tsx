import { Box, Button } from '@mui/joy';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleChangeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
      <Button
        onClick={() => handleChangeLanguage('en')}
        sx={{
          backgroundColor: 'lightgrey',
          color: 'black',
          '&:hover': {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        EN
      </Button>
      <Button
        onClick={() => handleChangeLanguage('es')}
        sx={{
          backgroundColor: 'lightgrey',
          color: 'black',
          '&:hover': {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        ES
      </Button>
    </Box>
  );
};

export default LanguageSelector;
