const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // npm install node-fetch@2

const app = express();
app.use(bodyParser.json());

const TELEGRAM_TOKEN = 'bot7960727448:AAF0B2mizrzj7sjHP68n-1IcjLoNc6kwVkE';
const CHAT_ID = '5567924440';

app.post('/order', async (req, res) => {
  const { name, phone, address, items, total } = req.body;
  const msg = `Новый заказ:\nИмя: ${name}\nТелефон: ${phone}\nАдрес: ${address}\nТовары:\n${items}\nИтого: ${total}c`;

  try {
    await fetch(`https://api.telegram.org/bot7960727448:AAF0B2mizrzj7sjHP68n-1IcjLoNc6kwVkE/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: 5567924440, text: msg })
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.listen(3000, () => console.log('Server started on port 3000'));