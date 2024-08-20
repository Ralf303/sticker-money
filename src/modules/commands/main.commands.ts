import { Telegraf, Scenes } from "telegraf";
import Command from "./commands.class";
import Redis from "../../services/redis/redis.class";
import Database from "../../services/database/db.class";
import { CustomContext } from "../../core/context";
import { StakeType } from "../../core/stakes";

export class Commands extends Command {
  private admins: string[];
  constructor(bot: Telegraf<CustomContext>, redis: Redis, db: Database) {
    super(bot, redis, db);
    /*
    1) Я
    2) Вадим
    3) Макс
    4) Кирилл
    */
    this.admins = ["1157591765", "625231929", "487820618", "524845066"];
  }
  //ладно теперь тут что то есть)
  handler(): void {
    this.bot.command("stakes", async (ctx) => {
      try {
        if (!this.admins.includes(String(ctx.from.id))) {
          return;
        }

        const stakes = await this.db.getStakes();
        const { jackpot, bar, lemons, berries, odd, correct } = stakes;
        await ctx.reply(
          `jackpot: ${jackpot}\nbar: ${bar}\nlemons: ${lemons}\nberries: ${berries}\nodd: ${odd}\ncorrect ${correct}`
        );
      } catch (error) {
        console.log(error);
      }
    });

    this.bot.command("set", async (ctx) => {
      try {
        if (!this.admins.includes(String(ctx.from.id))) {
          return;
        }

        const type: StakeType = ctx.args[0] as StakeType;

        const isUpdate: boolean = await this.db.updateStake(
          type,
          Number(ctx.args[1])
        );

        if (isUpdate) {
          return await ctx.reply(`${type} updated`);
        }
        await ctx.reply(`${type} not updated`);
      } catch (error) {
        console.log(error);
      }
    });
  }
}
