// const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const request = require("request-promise");
// const region = "asia-southeast1";

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.LindBot = functions.https.onRequest((req, res) => {
//     res.send('Hello World2');
// })

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer xxxxx`
};

exports.LineBot = functions.https.onRequest((req, res) => {
    if (req.body.events[0].message.type !== 'text') {
        return;
    }
    reply(req.body);
});

const reply = (bodyResponse) => {
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/reply`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            replyToken: bodyResponse.events[0].replyToken,
            messages: [
                {
                    type: `text`,
                    text: 'นี้คือข้อความจาก bot นะจ๊ะ'
                }
            ]
        })
    });
};

exports.LineBotPush = functions.https.onRequest((req, res) => {
    return request({
        method: `GET`,
        uri: `https://api.openweathermap.org/data/2.5/weather?units=metric&type=accurate&zip=10330,th&appid=yyyyy`,
        json: true
    }).then((response) => {
        const message = `City: ${response.name}\nWeather: ${response.weather[0].description}\nTemperature: ${response.main.temp}`;
        return push(res, message);
    }).catch((error) => {
        return res.status(500).send(error);
    });
});

const push = (res, msg) => {
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/push`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            to: `zzzzz`,
            messages: [
                {
                    type: `text`,
                    text: msg
                }
            ]
        })
    }).then(() => {
        return res.status(200).send(`Done`);
    }).catch((error) => {
        return Promise.reject(error);
    });
}