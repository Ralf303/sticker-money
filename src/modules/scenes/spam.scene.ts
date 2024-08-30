import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { CustomContext } from "../../core/context";
import Scene from "./scenes.class";
import Database from "../../services/database/db.class";
import { sleep } from "../../utils/helpers";
import Redis from "../../services/redis/redis.class";

class spamScene extends Scene {
  private bot: Scenes.BaseScene<CustomContext>;

  constructor(redis: Redis, db: Database) {
    super(redis, db);
    this.bot = new Scenes.BaseScene<CustomContext>("spamScene");
  }

  public init(): Scenes.BaseScene<CustomContext> {
    this.bot.enter(async (ctx) => {
      await ctx.reply(
        "Отправь мне сообщение которое отправится на рссылку или нажми /stop для отмены"
      );
    });

    this.bot.command("stop", async (ctx) => {
      await ctx.reply("Действие отменено");
      await ctx.scene.leave();
    });

    this.bot.on(message("text"), async (ctx) => {
      try {
        const { text } = ctx;
        const parse = ctx.entities();
        await ctx.react("👍");
        const users = await this.db.getUsers();
        let whiteUsers: number = 0;
        let blackUsers: number = 0;
        for (const user of users) {
          try {
            // @ts-ignore
            await ctx.telegram.sendMessage(user.chatId, text, {
              entities: parse,
            });
            whiteUsers++;
            await sleep(500);
          } catch (error) {
            blackUsers++;
            continue;
          }
        }

        await ctx.reply(
          `Рассылка закончена\n\nУспешно: ${whiteUsers}\nЗабанили бота ${blackUsers}`
        );
        await ctx.scene.leave();
      } catch (error) {
        console.log(error);
      }
    });

    this.bot.on(message("photo"), async (ctx) => {
      try {
        const { photo, caption } = ctx.message;
        const parse = ctx.entities();
        await ctx.react("👍");
        const users = await this.db.getUsers();
        let whiteUsers: number = 0;
        let blackUsers: number = 0;
        for (const user of users) {
          try {
            // @ts-ignore
            await ctx.telegram.sendPhoto(user.chatId, photo[0].file_id, {
              caption,
              caption_entities: parse,
            });
            whiteUsers++;
            await sleep(500);
          } catch (error) {
            blackUsers++;
            continue;
          }
        }

        await ctx.reply(
          `Рассылка закончена\n\nУспешно: ${whiteUsers}\nЗабанили бота ${blackUsers}`
        );
        await ctx.scene.leave();
      } catch (error) {
        console.log(error);
      }
    });
    return this.bot;
  }
}
export default spamScene;
