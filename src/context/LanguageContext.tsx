import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, LANGUAGES, LanguageOption, translations, TranslationKey } from "../i18n/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentLanguageOption: LanguageOption;
  languages: LanguageOption[];
  t: (key: TranslationKey, defaultText?: string) => string;
  formatBirr: (amountEtb: number) => string;
  isAmharic: boolean;
  isOromo: boolean;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "yacob_tech_selected_language";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "om" || saved === "am" || saved === "en") {
        return saved;
      }
    } catch (e) {
      console.warn("Could not retrieve saved language", e);
    }
    return "en";
  });

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
    } catch (e) {
      console.warn("Could not save language to localStorage", e);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: TranslationKey, defaultText?: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    if (translations.en[key]) {
      return translations.en[key];
    }
    return defaultText || key;
  };

  const formatBirr = (amountEtb: number): string => {
    const formattedNum = new Intl.NumberFormat().format(amountEtb);
    if (language === "am") {
      return `${formattedNum} ብር`;
    }
    if (language === "om") {
      return `Qarshii ${formattedNum} (ETB)`;
    }
    return `${formattedNum} ETB`;
  };

  const currentLanguageOption =
    LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currentLanguageOption,
        languages: LANGUAGES,
        t,
        formatBirr,
        isAmharic: language === "am",
        isOromo: language === "om",
        isEnglish: language === "en",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
