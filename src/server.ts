import express, { Application } from "express";
import cors from "cors";
import https from "https";
import fs from "fs";
import { Telegraf } from "telegraf";
import { CustomContext } from "./core/context";
import { IConfigService } from "./config/config.interface";
import Redis from "./services/redis/redis.class";
import Database from "./services/database/db.class";
import { IKeyboard } from "./keyboards/keyboard.interface";
import KeyboardService from "./keyboards/keyboard.service";

class Server {
  private port: number;
  private sert: string;
  private key: string;
  private app: Application;
  private webhookUrl: string;
  private token: string;
  private keyboard: IKeyboard;

  constructor(
    private bot: Telegraf<CustomContext>,
    private readonly redis: Redis,
    private db: Database,
    private configService: IConfigService
  ) {
    this.keyboard = new KeyboardService();
    this.port = parseInt(configService.get("PORT"), 10);
    this.sert = configService.get("CERT");
    this.key = configService.get("KEY");
    this.webhookUrl = configService.get("WEB_HOOK_URL");
    this.token = configService.get("BOT_TOKEN");
    this.app = express();
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.post("/payment", async (req, res) => {
      try {
        //@ts-ignore
        const { order_id, amount, in_amount } = req.body;

        if (in_amount >= amount) {
          await redis.deleteOrder(order_id);
          const user = await db.getUser(String(order_id));
          await db.updateUserBalance(user.id, user.balance + Number(amount));
          const message = await bot.telegram.sendMessage(
            user.chatId,
            `Оплата прошла успешно, баланс пополнен на ${amount}`,
            { reply_markup: this.keyboard.main() }
          );
          await this.redis.saveAction(Number(user.chatId), message);
          res.status(200).send("OK");
        } else {
          console.log("Ошибка: недостаточная сумма");
          res.status(400).send("ERROR AMOUNT");
        }
      } catch (e) {
        console.log(e);
        res.status(500).send("ERROR");
      }
    });

    if (this.webhookUrl) {
      bot.telegram.setWebhook(`${this.webhookUrl}/bot${this.token}`);
      this.app.use(bot.webhookCallback(`/bot${this.token}`));
    } else {
      this.app.listen(5000);
      bot.launch({ dropPendingUpdates: true });
      console.log("Бот запущен на пулинге");
    }
  }

  public async start() {
    if (this.webhookUrl) {
      const httpsOptions = {
        key: fs.readFileSync(this.key),
        cert: fs.readFileSync(this.sert),
      };

      https.createServer(httpsOptions, this.app).listen(this.port, () => {
        console.log(`HTTPS запустился на порту ${this.port}`);
      });

      https.createServer(httpsOptions, this.app).listen(5000, () => {
        console.log(`API HTTPS запустился на порту ${5000}`);
      });
      console.log(`бот запущен на вебхуке на ${this.webhookUrl}`);
    }
  }
}

export default Server;
