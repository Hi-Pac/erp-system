import en from './en.js';
import ar from './ar.js';

// Available languages
const languages = {
  en,
  ar
};

// Current language
let currentLanguage = localStorage.getItem('language') || 'en';

/**
 * Set the current language
 * @param {string} lang - Language code (en, ar)
 */
export const setLanguage = (lang) => {
  if (languages[lang]) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Dispatch language change event
    window.dispatchEvent(new CustomEvent('language:changed', { detail: { language: lang } }));
    
    // Update document direction
    document.body.classList.toggle('rtl', lang === 'ar');
    
    return true;
  }
  return false;
};

/**
 * Get the current language
 * @returns {string} - Current language code
 */
export const getLanguage = () => {
  return currentLanguage;
};

/**
 * Get a translation by key
 * @param {string} key - Translation key (e.g. 'common.save')
 * @param {Object} params - Parameters to replace in the translation
 * @returns {string} - Translated text
 */
export const t = (key, params = {}) => {
  const lang = languages[currentLanguage];
  
  if (!lang) {
    console.warn(`Language '${currentLanguage}' not found`);
    return key;
  }
  
  // Split key by dots (e.g. 'common.save' => ['common', 'save'])
  const keys = key.split('.');
  
  // Get the translation object
  let translation = lang;
  for (const k of keys) {
    translation = translation[k];
    
    if (translation === undefined) {
      console.warn(`Translation key '${key}' not found in language '${currentLanguage}'`);
      return key;
    }
  }
  
  // Replace parameters in the translation
  if (typeof translation === 'string') {
    return replaceParams(translation, params);
  }
  
  return key;
};

/**
 * Replace parameters in a translation string
 * @param {string} text - Translation text
 * @param {Object} params - Parameters to replace
 * @returns {string} - Text with replaced parameters
 */
const replaceParams = (text, params) => {
  return text.replace(/{(\w+)}/g, (match, key) => {
    return params[key] !== undefined ? params[key] : match;
  });
};

/**
 * Get the current language direction
 * @returns {string} - 'rtl' or 'ltr'
 */
export const getDirection = () => {
  return currentLanguage === 'ar' ? 'rtl' : 'ltr';
};

// Initialize language
const initLanguage = () => {
  document.body.classList.toggle('rtl', currentLanguage === 'ar');
};

// Initialize on load
initLanguage();

export default {
  t,
  setLanguage,
  getLanguage,
  getDirection
};