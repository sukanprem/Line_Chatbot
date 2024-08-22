const express = require('express');
const admin = require('firebase-admin');

const app = express();
const port = 3000;

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

// Example route to retrieve data from Firestore
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

// Example route to add data to Firestore
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

// Route สำหรับการอัปเดตข้อมูลใน Firestore (PUT Method)
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

// Route สำหรับการลบข้อมูลใน Firestore (DELETE Method)
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
