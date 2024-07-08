import { Telegraf, Scenes } from "telegraf";
import Action from "./actions.class";
import ru from "../../localization/ru.json";
import Redis from "../../services/redis/redis.class";
import Database from "../../services/database/db.class";
import { CustomContext } from "../../core/context";

export class StartActions extends Action {
  constructor(bot: Telegraf<CustomContext>, redis: Redis, db: Database) {
    super(bot, redis, db);
  }

  handler(): void {
    this.bot.action(ru.buttons.start, async (ctx) => {
      try {
        await ctx.scene.leave();
        await this.redis.checkAction(ctx.from.id, ctx);
        await ctx.deleteMessage();
        const message = await ctx.replyWithHTML(ru.main.games, {
          reply_markup: this.keyboardService.games(),
        });
        await this.redis.saveAction(ctx.from.id, message);
      } catch (error) {
        console.log("Ошибка при action start", error);
      }
    });

    this.bot.action(ru.buttons.back, async (ctx) => {
      try {
        await ctx.scene.leave();
        await this.redis.checkAction(ctx.from.id, ctx);
        await ctx.deleteMessage();
        const message = await ctx.replyWithHTML(
          `${ru.main.welcome}${ctx.from.first_name}${ru.main.main}`,
          {
            reply_markup: this.keyboardService.main(),
          }
        );
        await this.redis.saveAction(ctx.from.id, message);
      } catch (error) {
        console.log("Ошибка при action back", error);
      }
    });

    this.bot.action(ru.buttons.wallet, async (ctx) => {
      try {
        await this.redis.checkAction(ctx.from.id, ctx);
        const { id, first_name, username } = ctx.from;
        const user = await this.db.getUser(String(id), username, first_name);
        await ctx.deleteMessage();
        const message = await ctx.replyWithHTML(
          `${ru.main.balance.start}${user.balance} ${ru.main.balance.real}${user.demo} ${ru.main.balance.demo}`,
          {
            reply_markup: this.keyboardService.balance(),
          }
        );
        await this.redis.saveAction(ctx.from.id, message);
      } catch (error) {
        console.log("Ошибка при action balance", error);
      }
    });
  }
}
