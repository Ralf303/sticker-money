import express, { Application } from "express";
import cors from "cors";
import https from "https";
import fs from "fs";
import { Telegraf } from "telegraf";
import { CustomContext } from "./core/context";
import { IConfigService } from "./config/config.interface";

class Server {
  private port: number;
  private sert: string;
  private key: string;
  private app: Application;
  private webhookUrl: string;

  constructor(
    private bot: Telegraf<CustomContext>,
    private configService: IConfigService
  ) {
    this.port = parseInt(configService.get("PORT"), 10);
    this.sert = configService.get("CERT");
    this.key = configService.get("KEY");
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    this.webhookUrl = process.env.WEB_HOOK_URL || "";

    if (this.webhookUrl) {
      this.bot.telegram.setWebhook(
        `${this.webhookUrl}/bot${process.env.BOT_TOKEN}`
      );
      this.app.use(this.bot.webhookCallback(`/bot${process.env.BOT_TOKEN}`));
    } else {
      this.bot.launch({ dropPendingUpdates: true });
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

      console.log(`бот запущен на вебхуке на ${this.webhookUrl}`);
    }
  }
}

export default Server;
