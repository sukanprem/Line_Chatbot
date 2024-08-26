'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios'); // For making HTTP requests to the backend

const app = express();

const config = {
    channelAccessToken: 'ENKDsvTDe6tM0mXTXuOOfh4Ts9L83gJCgqfKGops41mJ5Oyvu9Y1j4C64O7dxJ5MG5YA6omBrZvfRt12uHdoV/XhMErs/kUE7ecSDcKPkjRFRe3wzjMjQw503jeq8k89ZmyU+bGroGsOVz7na8n73wdB04t89/1O/w1cDnyilFU=', // ใส่ค่า access token ของคุณที่นี่
    channelSecret: 'caac7ac0d65991394a32b6a1beacdf6e' // ใส่ค่า secret ของคุณที่นี่
};

const client = new line.Client(config);

app.post('/webhook', line.middleware(config), (req, res) => {
    Promise.all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    const { text } = event.message;

    // Example interaction: User sends a specific keyword to trigger backend action
    if (text === 'Check health') {
        return axios.get('http://localhost:3000/health-check-result')
            .then(response => {
                const healthData = response.data;
                const reply = `Latest health check: ${JSON.stringify(healthData[0])}`; // Simplified example
                return client.replyMessage(event.replyToken, { type: 'text', text: reply });
            })
            .catch(error => {
                console.error('Error:', error);
                return client.replyMessage(event.replyToken, { type: 'text', text: 'Error retrieving health check data.' });
            });
    }

    // Basic echo message
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text
    });
}

app.listen(3001, () => {
    console.log('Line Bot is running on port 3001');
});
