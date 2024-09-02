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

// async function handleEvent(event) {
//   if (event.type !== 'message' || event.message.type !== 'text') {
//     return Promise.resolve(null);
//   }

//   // แยกข้อความเพื่อดึง Document ID ที่ผู้ใช้ส่งมา
//   const documentId = event.message.text.trim();

//   try {
//     // ทำการดึงข้อมูลจาก Back End โดยใช้ Document ID
//     const response = await axios.get(`http://localhost:3000/health-check-result/${documentId}`);
//     const data = response.data;

//     // จัดรูปแบบข้อความที่จะส่งไปยังผู้ใช้
//     const message = {
//       type: 'text',
//       text: `myHealthFirst\n
//         ผลการตรวจร่างกายของคุณ ${data.fullName} ${data.lastName}\n
//         น้ำหนัก: ${data.weight} กิโลกรัม\n
//         ส่วนสูง: ${data.height} เซนติเมตร\n
//         ชีพจร: ${data.pulseRate}\n
//         อุณหภูมิ: ${data.temperature}\n
//         ออกซิเจนในเลือด: ${data.oxygenLevel}\n
//         อัตราการหายใจ: ${data.respirationRate}\n
//         น้ำตาลในเลือด: ${data.fastingBloodSugar}\n
//         เวลาที่เจาะ: ${data.mealTime} ${data.fastingTime}\n
//         รายละเอียดเพิ่มเติม: ${data.moreDetails}\n
//         BMI: ${data.bmi}\n
//         ความดันโลหิต: ${data.bloodPressure}`
//     };

//     // ส่งข้อความไปยัง Line Chatbot
//     return client.replyMessage(event.replyToken, message);
//   } catch (error) {
//     console.error("Error fetching health check result: ", error);

//     // ส่งข้อความแสดงข้อผิดพลาดหากเกิดข้อผิดพลาดในการดึงข้อมูล
//     return client.replyMessage(event.replyToken, {
//       type: 'text',
//       text: 'ขออภัย ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง'
//     });
//   }
// }

// app.listen(3001, () => {
//   console.log('Server is running on port 3001');
// });

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  // แยกข้อความเพื่อดึง Document ID ที่ผู้ใช้ส่งมา
  const documentId = event.message.text.trim();

  try {
    // ตรวจสอบในฐานข้อมูล HealthCheckResults
    let healthCheckData = null;
    try {
      const responseHealthCheck = await axios.get(`http://localhost:3000/health-check-result/${documentId}`);
      healthCheckData = responseHealthCheck.data;
    } catch (error) {
      // ถ้าไม่พบข้อมูลใน HealthCheckResults, ไม่ทำอะไร
      healthCheckData = null;
    }

    // ตรวจสอบในฐานข้อมูล BookDoctorAppointmentOnline
    let appointmentData = null;
    try {
      const responseAppointment = await axios.get(`http://localhost:3000/book-doctor-appointment-online/${documentId}`);
      appointmentData = responseAppointment.data;
    } catch (error) {
      // ถ้าไม่พบข้อมูลใน BookDoctorAppointmentOnline, ไม่ทำอะไร
      appointmentData = null;
    }

    // ตรวจสอบในฐานข้อมูล NotificationSettings
    let notificationData = null;
    try {
      const responseNotification = await axios.get(`http://localhost:3000/notification-settings/${documentId}`);
      notificationData = responseNotification.data;
    } catch (error) {
      // ถ้าไม่พบข้อมูลใน NotificationSettings, ไม่ทำอะไร
      notificationData = null;
    }

    // สร้างข้อความตอบกลับ
    let replyText = 'myHealthFirst\n';

    if (healthCheckData) {
      replyText += `\nผลการตรวจร่างกายของคุณ ${healthCheckData.fullName} ${healthCheckData.lastName}\n` +
                   `น้ำหนัก: ${healthCheckData.weight} กิโลกรัม\n` +
                   `ส่วนสูง: ${healthCheckData.height} เซนติเมตร\n` +
                   `ชีพจร: ${healthCheckData.pulseRate}\n` +
                   `อุณหภูมิ: ${healthCheckData.temperature}\n` +
                   `ออกซิเจนในเลือด: ${healthCheckData.oxygenLevel}\n` +
                   `อัตราการหายใจ: ${healthCheckData.respirationRate}\n` +
                   `น้ำตาลในเลือด: ${healthCheckData.fastingBloodSugar}\n` +
                   `เวลา: ${healthCheckData.mealTime} ${healthCheckData.fastingTime}\n` +
                   `รายละเอียดเพิ่มเติม: ${healthCheckData.moreDetails}\n` +
                   `BMI: ${healthCheckData.bmi}\n` +
                   `ความดันโลหิต: ${healthCheckData.bloodPressure}`;
    }

    if (appointmentData) {
      replyText += `\n\nจองพบแพทย์ออนไลน์:\n` +
                   `${appointmentData.fullName} ${appointmentData.lastName} จอง ${appointmentData.healthPlan}\n` +
                   `จาก ${appointmentData.hospital}\n` +
                   `แผนก ${appointmentData.department} วันที่: ${appointmentData.date}\n` +
                   `เวลา: ${appointmentData.time}`;
    }

    if (notificationData) {
      replyText += `ชื่อกลุ่ม: ${notificationData.groupName}\n` +
                   `ประเภท Line: ${notificationData.lineForm}\n` +
                   `ประเภทการแจ้งเตือน: ${notificationData.notificationTypes}\n` +
                   `Token: ${notificationData.token}\n`
    }

    if (!healthCheckData && !appointmentData && !notificationData) {
      replyText = 'ขออภัย ไม่พบข้อมูลที่ตรงกับ ID ที่คุณส่งมาTT';
    }

    // ส่งข้อความไปยัง LINE Chatbot
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: replyText
    });
  } catch (error) {
    console.error("Error fetching data: ", error);

    // ส่งข้อความแสดงข้อผิดพลาดหากเกิดข้อผิดพลาดในการดึงข้อมูล
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'ขออภัย ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้งTT'
    });
  }
}

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

// const express = require('express');
// const { Client, middleware } = require('@line/bot-sdk');

// const config = {
//   channelAccessToken: 'ENKDsvTDe6tM0mXTXuOOfh4Ts9L83gJCgqfKGops41mJ5Oyvu9Y1j4C64O7dxJ5MG5YA6omBrZvfRt12uHdoV/XhMErs/kUE7ecSDcKPkjRFRe3wzjMjQw503jeq8k89ZmyU+bGroGsOVz7na8n73wdB04t89/1O/w1cDnyilFU=',
//   channelSecret: 'caac7ac0d65991394a32b6a1beacdf6e'
// };

// const app = express();

// app.post('/webhook', middleware(config), (req, res) => {
//   const events = req.body.events;

//   Promise.all(events.map(handleEvent))
//     .then((result) => res.json(result))
//     .catch((err) => {
//       console.error(err);
//       res.status(500).end();
//     });
// });

// const client = new Client(config);

// function handleEvent(event) {
//   if (event.type !== 'message' || event.message.type !== 'text') {
//     return Promise.resolve(null);
//   }

//   const echo = { type: 'text', text: event.message.text };
//   return client.replyMessage(event.replyToken, echo);
// }

// app.listen(3001, () => {
//   console.log('Server is running on port 3001');
// });
