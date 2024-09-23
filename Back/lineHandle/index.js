const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');
const axios = require('axios');
const { createHealthCheckResultFlexMessage } = require('../../font/FlexMessageHandle/flexMessageForHealth');
const { createBookDoctorAppointmentOnlineFlexMessage } = require('../../font/FlexMessageHandle/flexMessageForBook');
const { createHospitalFlexMessage } = require('../../font/FlexMessageHandle/flexMessageForHospital');
require('dotenv').config(); // เรียกใช้ dotenv
// console.log(typeof createHealthCheckResultFlexMessage);
// console.log(typeof createBookDoctorAppointmentOnlineFlexMessage);

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const app = express();

app.post('/webhook', middleware(config), (req, res) => {
  const events = req.body.events;

  Promise.all(events.map(handleEvent))
    .then((result) => {
      res.status(200).json(result); // ส่ง status 200 ให้ LINE Platform
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end(); // ในกรณีเกิดข้อผิดพลาด
    });
});

const client = new Client(config);

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const messageText = event.message.text.trim();

  if (messageText.startsWith("subscribe ")) {
    const documentId = messageText.split(" ")[1];
    return handleSubscription(event, documentId);
  }

  // แยกข้อความเพื่อดึง Document ID ที่ผู้ใช้ส่งมา
  const documentId = event.message.text.trim();
//   let whereID ='';
  try {
    // ตรวจสอบในฐานข้อมูล HealthCheckResults
    let healthCheckData = null;
    try {
      const responseHealthCheck = await axios.get(`https://d1dd-223-205-61-145.ngrok-free.app/health-check-result/${documentId}`);
      healthCheckData = responseHealthCheck.data;
    //   whereID = '1';
    } catch (error) {
      // ถ้าไม่พบข้อมูลใน HealthCheckResults, ไม่ทำอะไร
      healthCheckData = null;
    }

    // ตรวจสอบในฐานข้อมูล BookDoctorAppointmentOnline
    let appointmentData = null;
    try {
      const responseAppointment = await axios.get(`https://d1dd-223-205-61-145.ngrok-free.app/book-doctor-appointment-online/${documentId}`);
      appointmentData = responseAppointment.data;
    //   whereID = '2';
    } catch (error) {
      // ถ้าไม่พบข้อมูลใน BookDoctorAppointmentOnline, ไม่ทำอะไร
      appointmentData = null;
    }

    // ตรวจสอบในฐานข้อมูล NotificationSettings
    let notificationData = null;
    try {
      const responseNotification = await axios.get(`https://d1dd-223-205-61-145.ngrok-free.app/notification-settings/${documentId}`);
      notificationData = responseNotification.data;
    //   whereID = '3';
    } catch (error) {
      // ถ้าไม่พบข้อมูลใน NotificationSettings, ไม่ทำอะไร
      notificationData = null;
    }

    // สร้างข้อความตอบกลับ
    let replyText = 'myHealthFirst\n';

    // if (healthCheckData) {
    //   const flex_message_for_health_check_data = createHealthCheckResultFlexMessage(healthCheckData);
    //   return client.replyMessage(event.replyToken, flex_message_for_health_check_data);
    // }

    if (healthCheckData) {
      // Create both Flex messages
      const flex_message_for_health_check_data = createHealthCheckResultFlexMessage(healthCheckData);
      const flex_message_for_hospital = createHospitalFlexMessage(healthCheckData);
    
      // Send both messages as an array
      return client.replyMessage(event.replyToken, [
        flex_message_for_health_check_data,
        flex_message_for_hospital
      ]);
    }

    if (appointmentData) {
      const flex_message_for_appointment_data = createBookDoctorAppointmentOnlineFlexMessage(appointmentData);
      return client.replyMessage(event.replyToken, flex_message_for_appointment_data);
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

async function handleSubscription(event, documentId) {
    const lineUserId = event.source.userId;
  
    try {
      const response = await axios.post('https://d1dd-223-205-61-145.ngrok-free.app/add-subscribe', {
        lineUserId: lineUserId,
        healthCheckResultId: documentId,
        notificationType: 'update' // หรือ 'once' ถ้าต้องการให้เป็นแบบครั้งเดียว
      });
  
      // ส่งข้อความตอบกลับไปยังผู้ใช้
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'คุณได้สมัครรับการแจ้งเตือนสำเร็จแล้ว!'
      });
    } catch (error) {
      console.error("Error subscribing to notifications: ", error);
  
      // ส่งข้อความแสดงข้อผิดพลาดหากเกิดข้อผิดพลาดในการสมัคร
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'ขออภัย ไม่สามารถสมัครรับการแจ้งเตือนได้ กรุณาลองใหม่อีกครั้ง'
      });
    }
}

app.listen(3002, () => {
  console.log('Server is running on port 3002');
});