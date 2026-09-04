import useLanguageStore from "../store/languageStore";
import { translations } from "./translations";

// "nav.dashboard" kabi kalitni lug'atdan topish
function resolve(dict, path) {
  return path.split(".").reduce((acc, k) => (acc == null ? undefined : acc[k]), dict);
}

export function useTranslation() {
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  const t = (key, params) => {
    const dict = translations[language] || translations.uz;
    let val = resolve(dict, key);
    if (val === undefined) val = resolve(translations.uz, key) ?? key;
    if (typeof val === "string" && params) {
      Object.entries(params).forEach(([k, v]) => {
        val = val.split("{" + k + "}").join(String(v));
      });
    }
    return val;
  };

  return { t, language, setLanguage };
}

export default useTranslation;