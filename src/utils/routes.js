import env from '../utils/client'

const {
    MODE,
    PUBLIC_DEV_GOOGLE_APPSCRIPT_ID, 
    PUBLIC_PROD_GOOGLE_APPSCRIPT_ID
} = env;
const id = (MODE === "production") 
            ? PUBLIC_PROD_GOOGLE_APPSCRIPT_ID 
            : PUBLIC_DEV_GOOGLE_APPSCRIPT_ID;

export const apiUrl = {
    buy: `https://script.google.com/macros/s/${id}/exec?type=buy`,
    contact: `https://script.google.com/macros/s/${id}/exec?type=contact`,
    availability: `https://script.google.com/macros/s/${id}/exec?type=availability`,
    currency: `https://script.google.com/macros/s/${id}/exec?type=currency`,
};