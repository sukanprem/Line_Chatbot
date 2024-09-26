// Line_Chatbot\Global\config.js

const BASE_URL = 'https://e87d-223-205-61-145.ngrok-free.app';

const REDIRECT_URI_FOR_BOOK = 'https://2e25-223-205-61-145.ngrok-free.app/calendar-form'

const REDIRECT_URI_FOR_SUBSCRIBED = 'https://2e25-223-205-61-145.ngrok-free.app/subscribe-form'

const CLIENT_ID = '2006377527'

const CHANNEL_SECRET = 'ed68198215c38554ee8e748bc3c3e07c'

const HEADERS = {
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json' // คุณสามารถเพิ่มหรือแก้ไข headers ได้ตามต้องการ
};

module.exports = {
    BASE_URL,
    HEADERS,
    REDIRECT_URI_FOR_BOOK,
    REDIRECT_URI_FOR_SUBSCRIBED,
    CLIENT_ID,
    CHANNEL_SECRET
};