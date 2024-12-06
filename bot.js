import TelegramBot from 'node-telegram-bot-api';

const webhookUrl = process.env.WEBHOOK_URL || 'https://finderteam.net';
const webhookSecret = process.env.WEBHOOK_SECRET || 'my-secure-secret';

class LeadBot extends TelegramBot {
  commandHandler;
  callbackQueryHandler;
  surveyHandler;
  notifyHandler;
  chatHandler;

  constructor(token, usePolling = true) {
    super(token, usePolling ? { polling: true } : {});

    // Инициализация обработчиков
    this.commandHandler = new CommandHandler(this);
    this.callbackQueryHandler = new CallbackQueryHandler(this);
    this.surveyHandler = new SurveyHandler(this);
    this.notifyHandler = new NotifyHandler(this);
    this.chatHandler = new ChatHandler(this);

    // Инициализация подписчиков событий
    this.initializeHandlers();

    // Настройка webhook или polling
    if (!usePolling) {
      this.setWebHook(`${webhookUrl}/${webhookSecret}`)
        .then(() => console.log(`Webhook установлен: ${webhookUrl}/${webhookSecret}`))
        .catch((error) => console.error('Ошибка при установке webhook:', error));
    }
  }

  // Метод для инициализации событий
  initializeHandlers() {
    // Подписка на текстовые сообщения
    this.onText(/.*/, async (msg, match) => {
      try {
        await this.handleMessage(msg, match);
      } catch (error) {
        console.error('Ошибка при обработке сообщения:', error);
      }
    });

    // Подписка на callback_query
    this.on('callback_query', async (query) => {
      try {
        await this.handleCallbackQuery(query);
      } catch (error) {
        console.error('Ошибка при обработке callback_query:', error);
      }
    });

    // Логирование ошибок
    this.on('polling_error', (error) => {
      console.error('LeadBot | Ошибка при опросе Telegram API:', error.message);
    });

    this.on('webhook_error', (error) => {
      console.error('LeadBot | Ошибка при использовании вебхуков:', error.message);
    });

    // Устанавливаем команды бота
    this.setMyCommands([
      { command: COMMANDS.start, description: 'Начать новый чат' },
      { command: COMMANDS.survey, description: 'Пройти опрос' },
      { command: COMMANDS.gettutor, description: 'Получить куратора' },
      { command: COMMANDS.help, description: 'Команды' },
    ]);
  }

  // Обработка текстовых сообщений
  async handleMessage(msg, match) {
    const text = msg.text || '';
    console.log(text)
  }

  // Обработка callback_query
  async handleCallbackQuery(query) {
    await this.callbackQueryHandler.mainHandler(query);
  }
}

export default LeadBot;
