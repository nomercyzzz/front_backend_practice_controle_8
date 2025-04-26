const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../front')));

const publicVapidKey = 'BMa_Pew397mjvu9DpNjVXZhVQNZQG83qfRCF9hSw9DPbxZqpy4Ka_Wh8CFLm_qgObgagtbohecJJQRUwdjjfcBA';
const privateVapidKey = '6jiK8HaGMmsrWUbsVGFW4F2pe1Fpv3GlaRlcvlAyeJc';

webpush.setVapidDetails('mailto:example@yourdomain.org', publicVapidKey, privateVapidKey);

app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    res.status(201).json({});

    const payload = JSON.stringify({ title: "Новая задача добавлена!" });

    webpush.sendNotification(subscription, payload).catch(error => {
        console.error(error);
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Сервер запущен на http://localhost:${PORT}`));
