const axios = require('axios')
const functions = require("firebase-functions");

exports.Hello = functions.https.onRequest((req, res) => {
    res.send('Hello World');
})

exports.LineBot = functions.https.onRequest((req, res) => {
    console.log("test log")
    console.log(req.body.events[0].source.userId)
    if (req.body.events[0].message.type !== 'text') {
        return;
    }
    reply(req.body);
});

exports.LineBotPush = functions.https.onRequest((req, res) => {
    const message = 'ส่งมาจาก line bot นะ'
    return push(message)
});

// exports.scheduledFunction = functions
//     .pubsub.schedule('* * * * *')
//     .onRun((context) => {
//         const message = 'ส่งข้อความทุกๆ 10 วิ'
//         push(message)
//     });

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer xxxx`
};

async function reply(bodyResponse) {
    const headers = LINE_HEADER
    const body = JSON.stringify({
        replyToken: bodyResponse.events[0].replyToken,
        messages: [
            {
                type: `text`,
                text: 'นี้คือข้อความจาก bot นะจ๊ะ'
            }
        ]
    })
    const resp = await axios.post(`${LINE_MESSAGING_API}/reply`, body, { headers: headers })
    return resp
};


async function push(msg) {
    const headers = LINE_HEADER;
    const body = JSON.stringify({
        to: 'Ub3f3f3abbf84e4fa8bde5dc6abaab841',
        messages: [
            {
                type: 'text',
                text: msg
            }
        ]
    });

    try {
        const resp = await axios.post(`${LINE_MESSAGING_API}/push`, body, { headers: headers });
        return resp;
    } catch (error) {
        throw error;
    }
}
