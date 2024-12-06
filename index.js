import TelegramBot from 'node-telegram-bot-api';
import express from 'express';
import bodyParser from 'body-parser';

const TOKEN = "7707716939:AAG5sYDx1gGEaGOWiY_bjqtBp9ImDHEIFME" // Установите токен через переменную окружения
const WEBHOOK_SECRET = 'your_webhook_secret'; // Секрет для вебхука
const PORT = 3000; // Порт для вебхука
const URL = `https://your-domain.com`; // Замените на ваш домен

const bot = new TelegramBot(TOKEN);
const app = express();

// Middlewares
app.use(bodyParser.json());

// Устанавливаем вебхук
bot.setWebHook(`${URL}/webhook/${WEBHOOK_SECRET}`)
  .then(() => console.log('Webhook установлен'))
  .catch(err => console.error('Ошибка при установке вебхука:', err));

// Обработка обновлений Telegram через вебхук
app.post(`/webhook/${WEBHOOK_SECRET}`, (req, res) => {
  bot.processUpdate(req.body);
  console.log(`/webhook/${WEBHOOK_SECRET}`)
  res.status(200).send('OK');
});

// Обработка текстовых сообщений
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Вы сказали: "${msg.text}"`);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
