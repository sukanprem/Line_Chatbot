const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors'); // นำเข้า cors

const app = express();
const port = 3000;

// ตั้งค่า CORS
// app.use(cors()); // ใช้งาน CORS สำหรับทุกที่

// const corsOptions = {
//   origin: 'http://localhost:3001', // อนุญาตให้เข้าถึงจากที่อยู่นี้
//   methods: 'GET,POST,PUT,DELETE', // ระบุวิธีการที่อนุญาต
//   allowedHeaders: 'Content-Type,Authorization' // ระบุ header ที่อนุญาต
// };

// app.use(cors(corsOptions));

// Initialize Firebase Admin SDK
const serviceAccount = require('./line-chatbot-de830-firebase-adminsdk-irdr9-a19bd78a94.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://line-chatbot-de830.firebaseio.com"
});

const db = admin.firestore();

app.use(express.json()); // Middleware สำหรับแปลง JSON body

app.get('/', (req, res) => {
  res.send('Hello World with Firebase!');
});

// The GET method reads notificationSettings data.
app.get('/notification-settings', async (req, res) => {
    try {
      const snapshot = await db.collection('notificationSettings').get();
      let settings = [];
      snapshot.forEach((doc) => {
        settings.push(doc.data());
      });
      res.json(settings);
    } catch (error) {
      console.error("Error retrieving notification settings: ", error);
      res.status(500).send('Error retrieving notification settings');
    }
});

// The POST method adds notificationSettings data.
app.post('/add-notification-setting', async (req, res) => {
  try {
    const { lineForm, groupName, token, notificationTypes } = req.body;

    // ตรวจสอบว่าได้รับค่าที่จำเป็นครบหรือไม่
    if (!lineForm || !groupName || !notificationTypes || !Array.isArray(notificationTypes)) {
      return res.status(400).send('Invalid request: Missing or incorrect fields.');
    }

    const newDocRef = db.collection('notificationSettings').doc(); // สร้างเอกสารใหม่พร้อม ID อัตโนมัติ
    await newDocRef.set({
      lineForm,
      groupName,
      token: token || '', // ใช้ค่าว่างหากไม่มี token
      notificationTypes
    });

    res.send('Notification setting added successfully!');
  } catch (error) {
    console.error("Error adding notification setting: ", error);
    res.status(500).send('Error adding notification setting');
  }
});

// PUT method updates notificationSettings data.
app.put('/update-notification-setting/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { lineForm, groupName, token, notificationTypes } = req.body;

    const docRef = db.collection('notificationSettings').doc(id);

    // ตรวจสอบว่าเอกสารมีอยู่หรือไม่
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).send('Notification setting not found');
    }

    // อัปเดตเอกสาร
    await docRef.update({
      lineForm, 
      groupName, 
      token, 
      notificationTypes
    });

    res.send('Notification setting updated successfully!');
  } catch (error) {
    console.error("Error updating notification setting: ", error);
    res.status(500).send('Error updating notification setting');
  }
});

// The DELETE method deletes notificationSettings data.
app.delete('/delete-notification-setting/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection('notificationSettings').doc(id);

    // ตรวจสอบว่าเอกสารมีอยู่หรือไม่
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).send('Notification setting not found');
    }

    // ลบเอกสาร
    await docRef.delete();

    res.send('Notification setting deleted successfully!');
  } catch (error) {
    console.error("Error deleting notification setting: ", error);
    res.status(500).send('Error deleting notification setting');
  }
});

// The GET method reads the healthCheckResults data.
app.get('/health-check-result', async (req, res) => {
  try {
    const snapshot = await db.collection('healthCheckResults').get();
    let settings = [];
    snapshot.forEach((doc) => {
      settings.push(doc.data());
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
      res.json(doc.data());
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
      fullName,
      lastName,
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
      bloodPressure
    } = req.body;

    // ตรวจสอบว่าได้รับค่าที่จำเป็นครบหรือไม่
    if (!fullName || !lastName || !weight || !height || !pulseRate || !temperature || !oxygenLevel || !respirationRate || !mealTime || !fastingTime || !fastingBloodSugar || !bloodPressure) {
      return res.status(400).send('Invalid request: Missing or incorrect fields.');
    }

    // คำนวณ BMI
    const heightInMeters = height / 100; // แปลงจากเซนติเมตรเป็นเมตร
    const bmi = weight / (heightInMeters * heightInMeters);

    const newDocRef = db.collection('healthCheckResults').doc(); // สร้างเอกสารใหม่พร้อม ID อัตโนมัติ
    await newDocRef.set({
      fullName,
      lastName,
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
      bloodPressure
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
      fullName,
      lastName,
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
      bloodPressure
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

    // อัปเดตเอกสาร
    await docRef.update({
      fullName: fullName || doc.data().fullName,
      lastName: lastName || doc.data().lastName,
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
      bloodPressure: bloodPressure || doc.data().bloodPressure
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
      settings.push(doc.data());
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
      res.json(doc.data());
    }
  } catch (error) {
    console.error("Error retrieving appointment data: ", error);
    res.status(500).send('Error retrieving appointment data: ');
  }
});

// The POST method adds BookDoctorAppointmentOnline data.
app.post('/add-book-doctor-appointment-online', async (req, res) => {
  try {
    const {
      fullName,
      lastName,
      healthPlan,
      hospital,
      doctor,
      department,
      date,
      time
    } = req.body;

    if(!fullName || !lastName || !healthPlan || !hospital || !doctor || !department || !date || !time) {
      return res.status(400).send('Invalid request: Missing or incorrect fields.');
    }

    const newDocRef = db.collection('BookDoctorAppointmentOnline').doc();
    await newDocRef.set({
      fullName,
      lastName,
      healthPlan,
      hospital,
      doctor,
      department,
      date,
      time
    });

    res.send('Book a doctor appointment online added successfully!');

  } catch (error) {
    console.error("Error adding book a doctor appointment online: ", error);
    res.status(500).send('Error adding book a doctor appointment online')
  }
});

// The PUT method updates BookDoctorAppointmentOnline data.
app.put('/update-book-doctor-appointment-online/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      lastName,
      healthPlan,
      hospital,
      doctor,
      department,
      date,
      time
    } = req.body;

    const docRef = db.collection('BookDoctorAppointmentOnline').doc(id);

    // ตรวจสอบว่าเอกสารมีอยู่หรือไม่
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).send('Book a doctor appointment online not found');
    }

    // อัปเดตเอกสาร
    await docRef.update({
      fullName: fullName || doc.data().fullName,
      lastName: lastName || doc.data().lastName,
      healthPlan: healthPlan || doc.data().healthPlan,
      hospital: hospital || doc.data().hospital,
      doctor: doctor || doc.data().doctor,
      department: department || doc.data().department,
      date: date || doc.data().date,
      time: time || doc.data().time
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
