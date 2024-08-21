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

app.get('/', (req, res) => {
  res.send('Hello World with Firebase!');
});

// Example route to add data to Firestore
// app.get('/add', async (req, res) => {
//   try {
//     const docRef = db.collection('users').doc('user1');
//     await docRef.set({
//       first: 'John',
//       last: 'Doe',
//       born: 1990
//     });
//     res.send('Document added successfully!');
//   } catch (error) {
//     console.error("Error adding document: ", error);
//     res.status(500).send('Error adding document');
//   }
// });

// Example route to add data to Firestore
app.get('/add-notification-setting', async (req, res) => {
    try {
      const docRef = db.collection('notificationSettings').doc('setting1');
      await docRef.set({
        lineForm: 'LineOA', // รูปแบบ (Line)
        groupName: 'Test', // ชื่อกลุ่ม
        token: '+mxXTWUhft/lds9sjCQLThOE7hSpYYa3Qc9Ex8f+/7NNB6075OpjZ0jIC/83ABlncS0BObm5K+8oDnHck6sKcILblYZv9AUU8TllWdaHWHWIE8Cp9Z1ybS0jfzi5iF6hDwggWQurGYX93oAOwwr9CQdB04t89/1O/w1cDnyilFU=', // รหัส (Token)
        notificationTypes: [ // เลือกการแจ้งเตือน
          'Check-up', 
          'Realtime Clinic', 
          'เพิ่มผลสุขภาพ (MHF)', 
          'เพิ่มผลสุขภาพ (MHC)', 
          'เพิ่มผลสุขภาพ (MHL)', 
          'เพิ่มผลสุขภาพ (LineOA)', 
          'TeleClinic (Reserve)'
        ]
      });
      res.send('Notification setting added successfully!');
    } catch (error) {
      console.error("Error adding notification setting: ", error);
      res.status(500).send('Error adding notification setting');
    }
});

// Example route to retrieve data from Firestore
// app.get('/users', async (req, res) => {
//   try {
//     const snapshot = await db.collection('users').get();
//     let users = [];
//     snapshot.forEach((doc) => {
//       users.push(doc.data());
//     });
//     res.json(users);
//   } catch (error) {
//     console.error("Error retrieving documents: ", error);
//     res.status(500).send('Error retrieving documents');
//   }
// });

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
