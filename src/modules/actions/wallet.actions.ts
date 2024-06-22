import { Telegraf, Scenes } from "telegraf";
import Action from "./actions.class";
import ru from "../../localization/ru.json";
import Redis from "../../services/redis/redis.class";
import Database from "../../services/database/db.class";
import { CustomContext } from "../../core/context";

export class WaletActions extends Action {
  constructor(bot: Telegraf<CustomContext>, redis: Redis, db: Database) {
    super(bot, redis, db);
  }

  handler(): void {
    this.bot.action(ru.buttons.balance.demo, async (ctx) => {
      try {
        await ctx.scene.leave();
        await this.redis.checkAction(ctx.from.id, ctx);
        const { id, first_name, username } = ctx.from;
        const user = await this.db.getUser(String(id), username, first_name);

        if (user.balance > 50) {
          return await ctx.answerCbQuery("У тебя и так много конфет");
        }

        await this.db.updateUserDemo(user.id, user.balance + 1000);
        return await ctx.answerCbQuery("Демо баланс пополнен");
      } catch (error) {
        console.log("Ошибка при action walet", error);
      }
    });
  }
}
