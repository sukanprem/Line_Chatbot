const express = require('express');
const axios = require('axios')
const qs = require("qs")
const admin = require('firebase-admin');
const { Client, middleware } = require('@line/bot-sdk');
const { createHealthCheckResultFlexMessage } = require('../font/FlexMessageHandle/flexMessageForHealth');
const { createHospitalFlexMessage } = require('../font/FlexMessageHandle/flexMessageForHospital')
const { createBookDoctorAppointmentOnlineFlexMessage } = require('../font/FlexMessageHandle/flexMessageForBook')
require('dotenv').config();
const { REDIRECT_URI_FOR_BOOK, CLIENT_ID, CHANNEL_SECRET, REDIRECT_URI_FOR_SUBSCRIBED } = require('./ui-for-back/src/component/Global/config')
// const CryptoJS = require('crypto-js');
// console.log(typeof createHealthCheckResultFlexMessage); // Should log 'function'
// console.log(typeof createHospitalFlexMessage); // Should log 'function'

const app = express();
const port = 3001;

// Initialize Firebase Admin SDK
const serviceAccount = require('./line-chatbot-de830-firebase-adminsdk-irdr9-a19bd78a94.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://line-chatbot-de830.firebaseio.com"
});

const db = admin.firestore();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const client = new Client(config);

const cors = require('cors');
app.use(cors()); // Enable CORS for all routes

app.use(express.json()); // Middleware สำหรับแปลง JSON body

app.get('/', (req, res) => {
  res.send('Hello World with Firebase!');
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;

  // Example: Simple username and password authentication
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username === adminUsername && password === adminPassword) {
    res.status(200).send('Login successful');
  } else {
    res.status(401).send('Invalid username or password');
  }
});

// // The GET method reads notificationSettings data.
// app.get('/notification-settings', async (req, res) => {
//   try {
//     const snapshot = await db.collection('notificationSettings').get();
//     let settings = [];
//     snapshot.forEach((doc) => {
//       settings.push(doc.data());
//     });
//     res.json(settings);
//   } catch (error) {
//     console.error("Error retrieving notification settings: ", error);
//     res.status(500).send('Error retrieving notification settings');
//   }
// });

// // The POST method adds notificationSettings data.
// app.post('/add-notification-setting', async (req, res) => {
//   try {
//     const { lineForm, groupName, token, notificationTypes } = req.body;

//     // ตรวจสอบว่าได้รับค่าที่จำเป็นครบหรือไม่
//     if (!lineForm || !groupName || !notificationTypes || !Array.isArray(notificationTypes)) {
//       return res.status(400).send('Invalid request: Missing or incorrect fields.');
//     }

//     const newDocRef = db.collection('notificationSettings').doc(); // สร้างเอกสารใหม่พร้อม ID อัตโนมัติ
//     await newDocRef.set({
//       lineForm,
//       groupName,
//       token: token || '', // ใช้ค่าว่างหากไม่มี token
//       notificationTypes
//     });

//     res.send('Notification setting added successfully!');
//   } catch (error) {
//     console.error("Error adding notification setting: ", error);
//     res.status(500).send('Error adding notification setting');
//   }
// });

// // PUT method updates notificationSettings data.
// app.put('/update-notification-setting/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { lineForm, groupName, token, notificationTypes } = req.body;

//     const docRef = db.collection('notificationSettings').doc(id);

//     // ตรวจสอบว่าเอกสารมีอยู่หรือไม่
//     const doc = await docRef.get();
//     if (!doc.exists) {
//       return res.status(404).send('Notification setting not found');
//     }

//     // อัปเดตเอกสาร
//     await docRef.update({
//       lineForm,
//       groupName,
//       token,
//       notificationTypes
//     });

//     res.send('Notification setting updated successfully!');
//   } catch (error) {
//     console.error("Error updating notification setting: ", error);
//     res.status(500).send('Error updating notification setting');
//   }
// });

// // The DELETE method deletes notificationSettings data.
// app.delete('/delete-notification-setting/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     const docRef = db.collection('notificationSettings').doc(id);

//     // ตรวจสอบว่าเอกสารมีอยู่หรือไม่
//     const doc = await docRef.get();
//     if (!doc.exists) {
//       return res.status(404).send('Notification setting not found');
//     }

//     // ลบเอกสาร
//     await docRef.delete();

//     res.send('Notification setting deleted successfully!');
//   } catch (error) {
//     console.error("Error deleting notification setting: ", error);
//     res.status(500).send('Error deleting notification setting');
//   }
// });

// นำเข้าไลบรารี crypto-js
const CryptoJS = require('crypto-js');
// const { REDIRECT_URI_FOR_BOOK } = require('./ui-for-back/src/component/Global/config');

// คีย์ลับสำหรับการเข้ารหัส
const secretKey = process.env.SECRET_KEY;

// The GET method reads the healthCheckResults data.
app.get('/health-check-result', async (req, res) => {
  try {
    const snapshot = await db.collection('healthCheckResults').get();
    let settings = [];
    snapshot.forEach((doc) => {
      // settings.push(doc.data());
      settings.push({
        id: doc.id, // Add the document ID
        ...doc.data() // Spread the rest of the document data
      })
    });
    res.json(settings);
  } catch (error) {
    console.error("Error retrieving health check result: ", error);
    res.status(500).send('Error retrieving health check result: ');
  }
});

// The GET method reads the healthCheckResults data by Document ID.
app.get('/health-check-result/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const doc = await db.collection('healthCheckResults').doc(docId).get();

    if (!doc.exists) {
      res.status(404).send('Document not found');
    } else {
      const data = doc.data();

      // ถอดรหัส citizenId ก่อนส่งข้อมูลกลับ
      const decryptedCitizenId = CryptoJS.AES.decrypt(data.citizenId, secretKey).toString(CryptoJS.enc.Utf8);

      res.json({
        ...data,
        citizenId: decryptedCitizenId // ส่ง citizenId ที่ถอดรหัสแล้วกลับไป
      });

      // res.json(doc.data());
    }
  } catch (error) {
    console.error("Error retrieving health check result: ", error);
    res.status(500).send('Error retrieving health check result: ');
  }
});

// The POST method adds healthCheckResults data.
app.post('/add-health-check-result', async (req, res) => {
  try {
    const {
      documentId, // เพิ่มฟิลด์ documentId เพื่อให้ระบุได้
      firstName,
      lastName,
      citizenId,
      weight,
      height,
      pulseRate,
      temperature,
      oxygenLevel,
      respirationRate,
      mealTime,
      fastingTime,
      fastingBloodSugar,
      moreDetails,
      bloodPressure,
      hospital
    } = req.body;

    // ตรวจสอบว่าได้รับค่าที่จำเป็นครบหรือไม่
    if (!firstName || !lastName || !citizenId || !weight || !height || !pulseRate || !temperature || !oxygenLevel || !respirationRate || !mealTime || !fastingTime || !fastingBloodSugar || !bloodPressure || !hospital) {
      return res.status(400).send('Invalid request: Missing or incorrect fields.');
    }

    // เข้ารหัส citizenId
    const encryptedCitizenId = CryptoJS.AES.encrypt(citizenId, secretKey).toString();

    // คำนวณ BMI
    const heightInMeters = height / 100; // แปลงจากเซนติเมตรเป็นเมตร
    const bmi = weight / (heightInMeters * heightInMeters);

    // ถ้ามีการระบุ documentId ให้ใช้ documentId ที่ส่งมา
    const newDocRef = documentId
      ? db.collection('healthCheckResults').doc(documentId) // ระบุ ID เอง
      : db.collection('healthCheckResults').doc(); // ถ้าไม่มี ID ให้ Firebase สร้าง ID อัตโนมัติ

    // เพิ่มข้อมูลไปยัง Firebase Firestore
    await newDocRef.set({
      firstName,
      lastName,
      citizenId: encryptedCitizenId, // เก็บ citizenId ที่เข้ารหัส
      weight,
      height,
      pulseRate,
      temperature,
      oxygenLevel,
      respirationRate,
      mealTime,
      fastingTime,
      fastingBloodSugar,
      moreDetails: moreDetails || '', // ใช้ค่าว่างหากไม่มีข้อความเตือน
      bmi, // ค่า BMI ที่คำนวณได้
      bloodPressure,
      hospital
    });

    res.send('Health check result added successfully!');
  } catch (error) {
    console.error("Error adding health check result: ", error);
    res.status(500).send('Error adding health check result');
  }
});

// The PUT method updates healthCheckResults data.
app.put('/update-health-check-result/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      citizenId, // เพิ่มฟิลด์ citizenId
      weight,
      height,
      pulseRate,
      temperature,
      oxygenLevel,
      respirationRate,
      mealTime,
      fastingTime,
      fastingBloodSugar,
      moreDetails,
      bloodPressure,
      hospital
    } = req.body;

    const docRef = db.collection('healthCheckResults').doc(id);

    // ตรวจสอบว่าเอกสารมีอยู่หรือไม่
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).send('Health check result not found');
    }

    // คำนวณ BMI ถ้ามีการส่งน้ำหนักและส่วนสูงใหม่มา
    let bmi = doc.data().bmi;
    if (weight && height) {
      const heightInMeters = height / 100;
      bmi = weight / (heightInMeters * heightInMeters);
    }

    // เข้ารหัส citizenId ถ้ามีการส่งมา
    let encryptedCitizenId = doc.data().citizenId; // ค่าเดิมจากฐานข้อมูล
    if (citizenId) {
      encryptedCitizenId = CryptoJS.AES.encrypt(citizenId, secretKey).toString();
    }

    // อัปเดตเอกสารใน Firebase
    await docRef.update({
      firstName: firstName || doc.data().firstName,
      lastName: lastName || doc.data().lastName,
      citizenId: encryptedCitizenId, // เก็บ citizenId ที่เข้ารหัส
      weight: weight || doc.data().weight,
      height: height || doc.data().height,
      pulseRate: pulseRate || doc.data().pulseRate,
      temperature: temperature || doc.data().temperature,
      oxygenLevel: oxygenLevel || doc.data().oxygenLevel,
      respirationRate: respirationRate || doc.data().respirationRate,
      mealTime: mealTime || doc.data().mealTime,
      fastingTime: fastingTime || doc.data().fastingTime,
      fastingBloodSugar: fastingBloodSugar || doc.data().fastingBloodSugar,
      moreDetails: moreDetails || doc.data().moreDetails,
      bmi: bmi, // ค่า BMI ที่คำนวณได้หรือค่าเดิมถ้าไม่มีการเปลี่ยนแปลง
      bloodPressure: bloodPressure || doc.data().bloodPressure,
      hospital: hospital || doc.data().hospital
    });

    // ตรวจสอบการสมัครรับข้อมูลและส่งการแจ้งเตือน (ส่วนนี้คงเดิม)
    const subscriptionsSnapshot = await db.collection('Subscriptions').where('healthCheckResultId', '==', id).get();

    subscriptionsSnapshot.forEach(async (subscriptionDoc) => {
      const subscriptionData = subscriptionDoc.data();

      const healthCheckData = {
        firstName: firstName || doc.data().firstName,
        lastName: lastName || doc.data().lastName,
        weight: weight || doc.data().weight,
        height: height || doc.data().height,
        pulseRate: pulseRate || doc.data().pulseRate,
        temperature: temperature || doc.data().temperature,
        oxygenLevel: oxygenLevel || doc.data().oxygenLevel,
        respirationRate: respirationRate || doc.data().respirationRate,
        fastingBloodSugar: fastingBloodSugar || doc.data().fastingBloodSugar,
        fastingTime: fastingTime || doc.data().fastingTime,
        moreDetails: moreDetails || doc.data().moreDetails,
        bmi: bmi, // ค่า BMI ที่คำนวณได้
        bloodPressure: bloodPressure || doc.data().bloodPressure,
        hospital: hospital || doc.data().hospital
      };

      // สร้าง Flex Message และส่งการแจ้งเตือน (ส่วนนี้คงเดิม)
      const flexMessageForHealthCheckResult = createHealthCheckResultFlexMessage(healthCheckData);
      const flexMessageForHospital = createHospitalFlexMessage(healthCheckData);

      client.pushMessage(subscriptionData.lineUserId, [flexMessageForHealthCheckResult, flexMessageForHospital])
        .then(() => {
          console.log('Flex message sent successfully');
        })
        .catch((error) => {
          console.error('Error sending flex message:', error);
        });

      // ถ้าเป็นการสมัครรับข้อมูลแบบครั้งเดียว ให้ลบการสมัครรับข้อมูลออก
      if (subscriptionData.notificationType === 'once') {
        await db.collection('Subscriptions').doc(subscriptionDoc.id).delete();
      }
    });

    res.send('Health check result updated successfully!');
  } catch (error) {
    console.error("Error updating health check result: ", error);
    res.status(500).send('Error updating health check result');
  }
});

// The DELETE method removes healthCheckResults data.
app.delete('/delete-health-check-result/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection('healthCheckResults').doc(id);

    // ตรวจสอบว่าเอกสารมีอยู่หรือไม่
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).send('Health check result not found');
    }

    // ลบเอกสาร
    await docRef.delete();

    res.send('Health check result deleted successfully!');
  } catch (error) {
    console.error("Error deleting health check result: ", error);
    res.status(500).send('Error deleting health check result');
  }
});

// The GET method reads the BookDoctorAppointmentOnline data.
app.get('/book-doctor-appointment-online', async (req, res) => {
  try {
    const snapshot = await db.collection('BookDoctorAppointmentOnline').get();
    let settings = [];
    snapshot.forEach((doc) => {
      // settings.push(doc.data());
      settings.push({
        id: doc.id, // เพิ่ม Document ID เข้าไปในข้อมูลที่ถูกส่งกลับ
        ...doc.data() // รวมข้อมูลอื่นๆ ของเอกสาร
      })
    });
    res.json(settings);
  } catch (error) {
    console.error("Error retrieving health check result: ", error);
    res.status(500).send('Error retrieving health check result: ');
  }
});

// The GET method reads the BookDoctorAppointmentOnline data by Document ID.
app.get('/book-doctor-appointment-online/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const doc = await db.collection('BookDoctorAppointmentOnline').doc(docId).get();

    if (!doc.exists) {
      res.status(404).send('Document not found');
    } else {
      const data = doc.data();

      // ตรวจสอบว่ามี citizenId หรือไม่ก่อนถอดรหัส
      let decryptedCitizenId = null;
      if (data.citizenId) {
        try {
          decryptedCitizenId = CryptoJS.AES.decrypt(data.citizenId, secretKey).toString(CryptoJS.enc.Utf8);
        } catch (error) {
          console.error('Error decrypting citizenId:', error);
        }
      }

      res.json({
        ...data,
        citizenId: decryptedCitizenId // ส่ง citizenId ที่ถอดรหัสแล้วหรือ null ถ้าไม่มี
      });
    }
  } catch (error) {
    console.error("Error retrieving appointment data: ", error);
    res.status(500).send('Error retrieving appointment data: ');
  }
});

app.get('/get-line-profile-for-booked', async (req, res) => {
  const { code } = req.query;
  // res.send({code: code})

  try {

    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post('https://api.line.me/oauth2/v2.1/token', qs.stringify({
      grant_type: 'authorization_code',
      code: decodeURIComponent(code),
      redirect_uri: `${REDIRECT_URI_FOR_BOOK}`,
      client_id: `${CLIENT_ID}`,
      client_secret: `${CHANNEL_SECRET}`,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { id_token, access_token } = tokenResponse.data;


    // Optionally, you can get additional profile info using the access token
    const profileResponse = await axios.get('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const profile = profileResponse.data;

    // Now you have the user's profile
    res.send(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
    res.status(500).send({ error: error.response ? error.response.data : error.message });

  }
});

app.get('/get-line-profile-for-subscribed', async (req, res) => {
  const { code } = req.query;
  // res.send({code: code})

  try {

    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post('https://api.line.me/oauth2/v2.1/token', qs.stringify({
      grant_type: 'authorization_code',
      code: decodeURIComponent(code),
      redirect_uri: `${REDIRECT_URI_FOR_SUBSCRIBED}`,
      client_id: `${CLIENT_ID}`,
      client_secret: `${CHANNEL_SECRET}`,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { id_token, access_token } = tokenResponse.data;


    // Optionally, you can get additional profile info using the access token
    const profileResponse = await axios.get('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const profile = profileResponse.data;

    // Now you have the user's profile
    res.send(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
    res.status(500).send({ error: error.response ? error.response.data : error.message });

  }
});

// The POST method adds BookDoctorAppointmentOnline data.
app.post('/add-book-doctor-appointment-online', async (req, res) => {
  try {
    const {
      time_slot_id,
      firstName,
      lastName,
      email,
      phone,
      citizenId,
      hospital,
      doctor_id,
      status,
      notes,
      created_at,
      updated_at,
      lineUserId
    } = req.body;

    // Encrypt citizenId before saving to the database
    let encryptedCitizenId = null;
    if (citizenId) {
      encryptedCitizenId = CryptoJS.AES.encrypt(citizenId, secretKey).toString();
    }

    // Save booking to Firestore
    const newDocRef = db.collection('BookDoctorAppointmentOnline').doc();
    await newDocRef.set({
      time_slot_id,
      firstName,
      lastName,
      citizenId: encryptedCitizenId,
      email,
      phone,
      hospital,
      doctor_id: doctor_id || '',
      status,
      notes: notes || '',
      created_at: created_at || new Date().toISOString(),
      updated_at: updated_at || new Date().toISOString(),
    });

    // Retrieve time slot data from the TimeSlots collection
    const timeSlotDoc = await db.collection('TimeSlots').doc(time_slot_id).get();
    if (!timeSlotDoc.exists) {
      throw new Error('Time slot not found');
    }

    const timeSlotData = timeSlotDoc.data();
    const dateId = timeSlotData.date_id;
    const appointmentTime = timeSlotData.time_slot;

    // Now query the Dates collection using the dateId from the TimeSlots document
    const dateDoc = await db.collection('Dates').doc(dateId).get();
    if (!dateDoc.exists) {
      throw new Error('Date not found');
    }

    const dateData = dateDoc.data();
    const appointmentDate = dateData.date;  // Assuming this field stores the actual date

    // Prepare the data to be sent in the Flex Message
    const appointmentData = {
      firstName,
      lastName,
      hospital,
      doctor: doctor_id || 'N/A',
      department: 'General Medicine', // Replace with actual department if available
      date: appointmentDate,  // Use the actual date from the Dates collection
      time: appointmentTime   // Use the time from the TimeSlots collection
    };

    console.log(appointmentTime)
    console.log(appointmentDate)
    console.log(appointmentData)

    // Create Flex Message using the data
    const flexMessageForAppointment = createBookDoctorAppointmentOnlineFlexMessage(appointmentData);

    // Send the Flex Message to the user on Line
    await client.pushMessage(lineUserId, flexMessageForAppointment)
      .then(() => {
        console.log('Flex message sent successfully');
      })
      .catch((error) => {
        console.error('Error sending flex message:', error);
      });

    res.send('Booking confirmed and message sent to Line user!');
  } catch (error) {
    console.error('Error adding doctor appointment booking:', error);
    res.status(500).send('Error adding doctor appointment booking');
  }
});

// The PUT method updates BookDoctorAppointmentOnline data.
app.put('/update-book-doctor-appointment-online/:id', async (req, res) => {
  try {

    const { id } = req.params;

    const {
      time_slot_id,
      firstName,
      lastName,
      email,
      phone,
      citizenId,  // เพิ่มฟิลด์ citizenId
      hospital,
      doctor_id,
      status,
      notes,
      created_at,
      updated_at
    } = req.body;

    const docRef = db.collection('BookDoctorAppointmentOnline').doc(id);

    // ตรวจสอบว่าเอกสารมีอยู่หรือไม่
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).send('Book a doctor appointment online not found');
    }

    // เข้ารหัส citizenId ถ้ามีการส่งมา
    let encryptedCitizenId = doc.data().citizenId;
    if (citizenId) {
      encryptedCitizenId = CryptoJS.AES.encrypt(citizenId, secretKey).toString();
    }

    // อัปเดตเอกสาร
    await docRef.update({
      time_slot_id: time_slot_id || doc.data().time_slot_id,
      firstName: firstName || doc.data().firstName,
      lastName: lastName || doc.data().lastName,
      citizenId: encryptedCitizenId,  // บันทึก citizenId ที่เข้ารหัส (หรือค่าเดิม)
      email: email || doc.data().email,
      phone: phone || doc.data().phone,
      hospital: hospital || doc.data().hospital,
      doctor_id: doctor_id || doc.data().doctor_id,
      status: status || doc.data().status,
      notes: notes || doc.data().notes,
      created_at: created_at || doc.data().created_at,
      updated_at: updated_at || doc.data().updated_at
    });

    res.send('Book a doctor appointment online updated successfully!');

  } catch (error) {
    console.error("Error updating Book a doctor appointment online: ", error);
    res.status(500).send('Error updating Book a doctor appointment online');
  }
});

// The DELETE method removes BookDoctorAppointmentOnline data.
app.delete('/delete-book-doctor-appointment-online/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection('BookDoctorAppointmentOnline').doc(id);

    // ตรวจสอบว่าเอกสารมีอยู่หรือไม่
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).send('Book a doctor appointment online not found');
    }

    // ลบเอกสาร
    await docRef.delete();

    res.send('Book a doctor appointment online deleted successfully!');
  } catch (error) {
    console.error("Error deleting Book a doctor appointment online: ", error);
    res.status(500).send('Error deleting Book a doctor appointment online');
  }
});

// The GET method reads the Subscriptions data.
app.get('/subscribe', async (req, res) => {
  try {
    const snapshot = await db.collection('Subscriptions').get();
    let settings = [];
    snapshot.forEach((doc) => {
      // settings.push(doc.data());
      settings.push({
        id: doc.id, // Add the document ID
        ...doc.data() // Spread the rest of the document data
      })
    });
    res.json(settings);
  } catch (error) {
    console.error("Error retrieving subscriptions: ", error);
    res.status(500).send('Error retrieving subscriptions: ');
  }
});

// The GET method reads the Subscriptions data by Document ID.
app.get('/subscribe/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const doc = await db.collection('Subscriptions').doc(docId).get();

    if (!doc.exists) {
      res.status(404).send('Document not found');
    } else {
      res.json(doc.data());
    }
  } catch (error) {
    console.error("Error retrieving subscriptions: ", error);
    res.status(500).send('Error retrieving subscriptions: ');
  }
});

// The POST method adds Subscriptions data.
app.post('/add-subscribe', async (req, res) => {
  try {
    const { lineUserId, healthCheckResultId, notificationType } = req.body;

    if (!lineUserId || !healthCheckResultId || !notificationType) {
      return res.status(400).send('Invalid request: Missing or incorrect fields.');
    }

    const newDocRef = db.collection('Subscriptions').doc(); // สร้างเอกสารใหม่พร้อม ID อัตโนมัติ
    await newDocRef.set({
      lineUserId,
      healthCheckResultId,
      notificationType
    });

    res.send('Subscription added successfully!');
  } catch (error) {
    console.error("Error adding subscription: ", error);
    res.status(500).send('Error adding subscription');
  }
});

// The PUT method updates Subscriptions data.
app.put('/update-subscribe/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { lineUserId, healthCheckResultId, notificationType } = req.body;

    const docRef = db.collection('Subscriptions').doc(id);

    // ตรวจสอบว่าเอกสารมีอยู่หรือไม่
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).send('Subscriptions not found');
    }

    // อัปเดตเอกสาร
    await docRef.update({
      lineUserId: lineUserId || doc.data().lineUserId,
      healthCheckResultId: healthCheckResultId || doc.data().healthCheckResultId,
      notificationType: notificationType || doc.data().notificationType
    });

    res.send('Subscriptions updated successfully!');
  } catch (error) {
    console.error("Error updating subscriptions: ", error);
    res.status(500).send('Error updating subscriptions');
  }
});

// The DELETE method removes Subscriptions data.
app.delete('/delete-subscribe/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection('Subscriptions').doc(id);

    // ตรวจสอบว่าเอกสารมีอยู่หรือไม่
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).send('Subscriptions not found');
    }

    // ลบเอกสาร
    await docRef.delete();

    res.send('Subscriptions deleted successfully!');
  } catch (error) {
    console.error("Error deleting subscriptions: ", error);
    res.status(500).send('Error deleting subscriptions');
  }
});

// The GET method reads the Dates data.
app.get('/dates', async (req, res) => {
  try {
    const snapshot = await db.collection('Dates').get();
    let settings = [];
    snapshot.forEach((doc) => {
      // settings.push(doc.data());
      settings.push({
        id: doc.id, // Add the document ID
        ...doc.data() // Spread the rest of the document data
      })
    });
    res.json(settings);
  } catch (error) {
    console.error("Error retrieving dates: ", error);
    res.status(500).send('Error retrieving dates: ');
  }
});

// The GET method reads the Dates data by Document ID.
app.get('/dates/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const doc = await db.collection('Dates').doc(docId).get();

    if (!doc.exists) {
      res.status(404).send('Document not found');
    } else {
      res.json(doc.data());
    }
  } catch (error) {
    console.error("Error retrieving dates: ", error);
    res.status(500).send('Error retrieving dates: ');
  }
});

// The GET method reads the Dates data by a specific date.
app.get('/dates-by-date', async (req, res) => {
  try {
    const { date } = req.query; // Get the date from the query parameters

    if (!date) {
      return res.status(400).send('Invalid request: Missing date field.');
    }

    const snapshot = await db.collection('Dates').where('date', '==', date).get();

    if (snapshot.empty) {
      return res.status(404).send('No documents found for the provided date.');
    }

    let dates = [];
    snapshot.forEach((doc) => {
      dates.push({
        id: doc.id, // Add the document ID
        ...doc.data() // Spread the rest of the document data
      });
    });

    res.json(dates);
  } catch (error) {
    console.error("Error retrieving dates by date: ", error);
    res.status(500).send('Error retrieving dates by date.');
  }
});

// The POST method adds Dates data.
app.post('/add-dates', async (req, res) => {
  try {
    const { date, status } = req.body;

    if (!date || !status) {
      return res.status(400).send('Invalid request: Missing or incorrect fields.');
    }

    const newDocRef = db.collection('Dates').doc(); // สร้างเอกสารใหม่พร้อม ID อัตโนมัติ
    await newDocRef.set({
      date,
      status
    });

    res.send('Dates added successfully!');
  } catch (error) {
    console.error("Error adding dates: ", error);
    res.status(500).send('Error adding dates');
  }
});

// The PUT method updates Dates data.
app.put('/update-dates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, status } = req.body;

    const docRef = db.collection('Dates').doc(id);

    // ตรวจสอบว่าเอกสารมีอยู่หรือไม่
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).send('Dates not found');
    }

    // อัปเดตเอกสาร
    await docRef.update({
      date: date || doc.data().date,
      status: status || doc.data().status
    });

    res.send('Dates updated successfully!');
  } catch (error) {
    console.error("Error updating dates: ", error);
    res.status(500).send('Error updating dates');
  }
});

// The DELETE method removes Dates data.
app.delete('/delete-dates/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection('Dates').doc(id);

    // ตรวจสอบว่าเอกสารมีอยู่หรือไม่
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).send('Dates not found');
    }

    // ลบเอกสาร
    await docRef.delete();

    res.send('Dates deleted successfully!');
  } catch (error) {
    console.error("Error deleting dates: ", error);
    res.status(500).send('Error deleting dates');
  }
});

// The GET method reads the TimeSlots data.
app.get('/time-slots', async (req, res) => {
  try {
    const snapshot = await db.collection('TimeSlots').get();
    let settings = [];
    snapshot.forEach((doc) => {
      // settings.push(doc.data());
      settings.push({
        id: doc.id, // Add the document ID
        ...doc.data() // Spread the rest of the document data
      })
    });
    res.json(settings);
  } catch (error) {
    console.error("Error retrieving time slots: ", error);
    res.status(500).send('Error retrieving time slots: ');
  }
});

// The GET method reads the Time Slots data by Document ID.
app.get('/time-slots/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const doc = await db.collection('TimeSlots').doc(docId).get();

    if (!doc.exists) {
      res.status(404).send('Document not found');
    } else {
      res.json(doc.data());
    }
  } catch (error) {
    console.error("Error retrieving time slots: ", error);
    res.status(500).send('Error retrieving time slots: ');
  }
});

// The GET method to retrieve available time slots for a specific date.
app.get('/get-time-slots', async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).send('Invalid request: Missing date.');
    }

    // Step 1: Find the document in the Dates collection based on the provided date.
    const datesSnapshot = await db.collection('Dates').where('date', '==', date).get();

    if (datesSnapshot.empty) {
      return res.status(404).send('No available time slots for the given date.');
    }

    // Step 2: Retrieve the date_id from the Dates collection
    let date_id = null;
    datesSnapshot.forEach(doc => {
      date_id = doc.id;  // Assuming you only have one date for each date value.
    });

    // Step 3: Use the date_id to query the TimeSlots collection
    const timeSlotsSnapshot = await db.collection('TimeSlots').where('date_id', '==', date_id).get();

    if (timeSlotsSnapshot.empty) {
      return res.status(404).send('No time slots available for the selected date.');
    }

    // Step 4: Gather all time slots and send them in the response
    const timeSlots = [];
    timeSlotsSnapshot.forEach(doc => {
      timeSlots.push({
        id: doc.id, // The document ID for reference if needed
        ...doc.data() // All other fields from the time slot document
      });
    });

    res.json({
      date,
      timeSlots
    });
  } catch (error) {
    console.error("Error retrieving time slots: ", error);
    res.status(500).send('Error retrieving time slots.');
  }
});

// The GET method to retrieve all dates with corresponding time slots.
app.get('/get-all-dates-with-time-slots', async (req, res) => {
  try {
    // Step 1: Fetch all the documents from the Dates collection
    const datesSnapshot = await db.collection('Dates').get();

    if (datesSnapshot.empty) {
      return res.status(404).send('No dates available.');
    }

    // Step 2: Prepare an array to hold the results
    let result = [];

    // Step 3: Loop through each date document
    for (let dateDoc of datesSnapshot.docs) {
      const dateData = dateDoc.data();
      const date_id = dateDoc.id;

      // Step 4: Query TimeSlots collection for each date_id
      const timeSlotsSnapshot = await db.collection('TimeSlots').where('date_id', '==', date_id).get();

      let timeSlots = [];
      timeSlotsSnapshot.forEach(timeSlotDoc => {
        timeSlots.push({
          id: timeSlotDoc.id, // The document ID for the time slot
          ...timeSlotDoc.data() // All other fields from the time slot document
        });
      });

      // Step 5: Add the date and its corresponding time slots to the result
      result.push({
        date: dateData.date,
        timeSlots
      });
    }

    // Step 6: Return the aggregated result
    res.json(result);
  } catch (error) {
    console.error("Error retrieving dates with time slots: ", error);
    res.status(500).send('Error retrieving dates with time slots.');
  }
});

// The POST method adds Time Slots data.
app.post('/add-time-slots', async (req, res) => {
  try {
    console.log(req.body); // Log the request body for debugging
    const { date_id, time_slot, max_appointments, booked_appointments } = req.body;

    if (!date_id || !time_slot || !max_appointments || booked_appointments === undefined || booked_appointments === null) {
      return res.status(400).send('Invalid request: Missing or incorrect fields.');
    }

    const newDocRef = db.collection('TimeSlots').doc(); // สร้างเอกสารใหม่พร้อม ID อัตโนมัติ
    await newDocRef.set({
      date_id,
      time_slot,
      max_appointments,
      booked_appointments
    });

    res.send('Time slots added successfully!');
  } catch (error) {
    console.error("Error adding time slots: ", error);
    res.status(500).send('Error adding time slots');
  }
});

// The PUT method updates Time Slots data.
app.put('/update-time-slots/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { date_id, time_slot, max_appointments, booked_appointments } = req.body;

    const docRef = db.collection('TimeSlots').doc(id);

    // ตรวจสอบว่าเอกสารมีอยู่หรือไม่
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).send('Time slots not found');
    }

    // อัปเดตเอกสาร
    await docRef.update({
      date_id: date_id || doc.data().date_id,
      time_slot: time_slot || doc.data().time_slot,
      max_appointments: max_appointments || doc.data().max_appointments,
      booked_appointments: booked_appointments || doc.data().booked_appointments
    });

    res.send('Time slots updated successfully!');
  } catch (error) {
    console.error("Error updating time slots: ", error);
    res.status(500).send('Error updating time slots');
  }
});

// The DELETE method removes Time Slots data.
app.delete('/delete-time-slots/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection('TimeSlots').doc(id);

    // ตรวจสอบว่าเอกสารมีอยู่หรือไม่
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).send('Dates not found');
    }

    // ลบเอกสาร
    await docRef.delete();

    res.send('Time slots deleted successfully!');
  } catch (error) {
    console.error("Error deleting Time slots: ", error);
    res.status(500).send('Error deleting time slots');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
