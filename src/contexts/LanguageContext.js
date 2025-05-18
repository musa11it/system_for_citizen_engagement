import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    home: 'Home',
    aboutUs: 'About Us',
    submitComplaint: 'Submit Complaint',
    trackComplaint: 'Track Complaint',
    adminDashboard: 'Admin Dashboard',
    search: 'Search...',
    login: 'Login',
    register: 'Register',
    logout: 'Logout'
  },
  rw: {
    home: 'Ahabanza',
    aboutUs: 'Turi Ba Nde',
    submitComplaint: 'Tanga Ikibazo',
    trackComplaint: 'Kurikirana Ikibazo',
    adminDashboard: 'Ibiro by\'Umuyobozi',
    search: 'Shakisha...',
    login: 'Injira',
    register: 'Iyandikishe',
    logout: 'Sohoka'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);