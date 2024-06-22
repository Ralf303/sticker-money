import { Telegraf } from "telegraf";
import Action from "./actions.class";
import { CustomContext } from "../../core/context";
import Redis from "../../services/redis/redis.class";
import Database from "../../services/database/db.class";
import ru from "../../localization/ru.json";

export class OptionActions extends Action {
  constructor(bot: Telegraf<CustomContext>, redis: Redis, db: Database) {
    super(bot, redis, db);
  }

  handler(): void {
    this.bot.action(/^(?:Четный|Нечетный|[1-6])$/, async (ctx) => {
      try {
        await this.redis.checkAction(ctx.from.id, ctx);
        //@ts-ignore
        const { data } = ctx.update.callback_query;
        await this.redis.checkAction(ctx.from.id, ctx);
        const { id, first_name, username } = ctx.from;
        const user = await this.db.getUser(String(id), username, first_name);
        const status = await this.redis.getStatus(id);
        await this.redis.setOption(id, data);
        const stake = await this.redis.getStake(id);
        let text: string;
        await ctx.deleteMessage();

        switch (status) {
          case "demo":
            text = `${ru.main.demo} ${user.demo}🍬\n\n${ru.main.сube.stake}`;
            break;

          case "real":
            text = `${ru.main.real} ${user.balance}💸\n\n${ru.main.сube.stake}`;
            break;
          default:
            return;
        }

        const message = await ctx.replyWithHTML(text, {
          reply_markup: this.keyboardService.cube(stake, data),
        });
        await this.redis.saveAction(ctx.from.id, message);
      } catch (e) {
        console.log(e);
      }
    });
  }
}
