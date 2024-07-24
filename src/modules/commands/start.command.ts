import { Telegraf, Scenes } from "telegraf";
import Command from "./commands.class";
import ru from "../../localization/ru.json";
import Redis from "../../services/redis/redis.class";
import Database from "../../services/database/db.class";
import { CustomContext } from "../../core/context";

export class StartCommand extends Command {
  constructor(bot: Telegraf<CustomContext>, redis: Redis, db: Database) {
    super(bot, redis, db);
  }

  async handler(): Promise<void> {
    this.bot.start(async (ctx) => {
      try {
        await ctx.scene.leave();
        const { id, first_name, username } = ctx.from;
        const user = await this.db.getUser(String(id), username, first_name);
        if (user.isBan) return await ctx.reply(ru.main.ban);
        const keyboard = this.keyboardService.main();
        const message = await ctx.reply(
          `${ru.main.welcome}${first_name}${ru.main.main}`,
          {
            reply_markup: keyboard,
          }
        );
        await this.redis.saveAction(ctx.from.id, message);
      } catch (error) {
        console.log(error);
      }
    });
  }
}
