import { Box, Button } from '@mui/joy';
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleChangeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
      <Button onClick={() => handleChangeLanguage('en')} >EN</Button>
      <Button onClick={() => handleChangeLanguage('es')} >ES</Button>
    </Box>
  );
};

export default LanguageSelector;
