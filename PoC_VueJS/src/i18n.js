import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'

const messages = {
  en,
  fr
}

export default createI18n({
  legacy: false,
  locale: 'fr', // langue par défaut
  fallbackLocale: 'en',
  messages
})
