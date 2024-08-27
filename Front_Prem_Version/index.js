const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');
const axios = require('axios');

const config = {
  channelAccessToken: 'ENKDsvTDe6tM0mXTXuOOfh4Ts9L83gJCgqfKGops41mJ5Oyvu9Y1j4C64O7dxJ5MG5YA6omBrZvfRt12uHdoV/XhMErs/kUE7ecSDcKPkjRFRe3wzjMjQw503jeq8k89ZmyU+bGroGsOVz7na8n73wdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'caac7ac0d65991394a32b6a1beacdf6e'
};

const app = express();

app.post('/webhook', middleware(config), (req, res) => {
  const events = req.body.events;

  Promise.all(events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

const client = new Client(config);

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userMessage = event.message.text;

  // ตรวจสอบว่า message เป็นคำสั่งสำหรับดึงข้อมูลหรือไม่ เช่น "ผลตรวจสุขภาพ 1234"
  if (userMessage.startsWith('ผลตรวจสุขภาพ')) {
    const id = userMessage.split(' ')[1]; // สมมติว่า ID อยู่หลังคำว่า "ผลตรวจสุขภาพ"
    
    try {
      // ดึงข้อมูลจาก API ของคุณ
      const response = await axios.get(`http://localhost:3000/health-check-result/${id}`);
      const healthResult = response.data;

      // สร้างข้อความตอบกลับจากข้อมูลที่ได้รับ
      const replyMessage = {
        type: 'text',
        text: `ผลตรวจสุขภาพของคุณคือ: ${healthResult.result}`
      };

      return client.replyMessage(event.replyToken, replyMessage);
    } catch (error) {
      console.error('Error fetching health check result:', error);
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'ไม่สามารถดึงข้อมูลผลตรวจสุขภาพได้ โปรดลองใหม่อีกครั้ง'
      });
    }
  } else {
    // ถ้าไม่ใช่คำสั่งพิเศษ ส่งข้อความเดิมกลับไป
    const echo = { type: 'text', text: event.message.text };
    return client.replyMessage(event.replyToken, echo);
  }
}

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
