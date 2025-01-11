import en from "./en.js";

const ru = {};

// генерация русского словаря из английского
for (const [key] of Object.entries(en)) {
    const value = key.includes('.') 
                    ? key.substring(key.indexOf('.')+1)
                    : key;
    ru[key] = value;
}

export default ru;