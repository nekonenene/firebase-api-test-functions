// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const express = require('express');
const cors = require('cors');
const app = express();

// cross-origin リクエストを受け付ける（Access-Control-Allow-Origin の指定が不要に）
app.use(cors({ origin: true }));

// JSON のパースに必要だと書いてあったが、 firebase-functions がよしなにやってくれてるのかも？
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// こんにちはを返す
// curl "https://us-central1-api-test-ce66e.cloudfunctions.net/api/hello/にゃんきち"
app.get('/hello/:name', (req, res) => {
  const name = req.params.name;
  const response = {
    status: 'ok',
    result: `こんにちは、${name}！`,
  }
  return res.status(200).json(response);
});

// Database に加える（Webブラウザでのテスト用）
// https://us-central1-api-test-ce66e.cloudfunctions.net/message?text=こんにちは！！！
app.get('/message', async (req, res) => {
  // Grab the text parameter.
  const text = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  const snapshot = await admin.database().ref('/messages').push({
    text: text,
  });
  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  res.redirect(303, snapshot.ref.toString());
});

// Database に加える
// curl -X POST -H 'Content-Type: application/json' -d '{"text": "おはよう"}' "https://us-central1-api-test-ce66e.cloudfunctions.net/api/message"
app.post('/message', async (req, res) => {
  const text = req.body.text;
  await admin.database().ref('/messages').push({
    text: text,
  });
  res.status(200).json({ status: 'OK', result: `Added ${text}` });
});

// さしすせそリストを返す
// curl https://us-central1-api-test-ce66e.cloudfunctions.net/api/items
app.get('/items', (_, res) => {
  const response = {
    status: 'ok',
    result: [
      {
        id: 1,
        item: '砂糖',
      },
      {
        id: 2,
        item: '塩',
      },
      {
        id: 3,
        item: 'お酢',
      },
      {
        id: 4,
        item: 'しょうゆ',
      },
      {
        id: 5,
        item: '味噌',
      },
    ]
  }

  return res.status(200).json(response);
});

// 3乗する
// curl -X POST -H 'Content-Type: application/json' -d '{"number": 3}' https://us-central1-api-test-ce66e.cloudfunctions.net/api/third-power
app.post('/third-power', (req, res) => {
  if (isNullOrUndefined(req.body) || isNullOrUndefined(req.body.number)) {
    return res.status(400).send('number param is required');
  }
  const num = Number(req.body.number);
  const answer = num * num * num;
  const response = {
    status: 'ok',
    result: `${num} * ${num} * ${num} = ${answer}`,
  }
  return res.status(200).json(response);
});

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);


////////////////////////   使ってないやつ（参考に残しておく）  ////////////////////////////////
// 3乗する
exports.thirdPower = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  } else if (isNullOrUndefined(req.body) || isNullOrUndefined(req.body.number)) {
    return res.status(400).send('Request Body Not Found');
  }

  const num = Number(req.body.number);
  const answer = num * num * num;
  const response = {
    status: 'ok',
    result: `${num} * ${num} * ${num} = ${answer}`,
  }
  return res.status(200).send(JSON.stringify(response));
});

function isNullOrUndefined(val) {
  return (val === null) || (val === undefined);
}
