import { Telegraf, Scenes } from "telegraf";
import Command from "./commands.class";
import Redis from "../../services/redis/redis.class";
import Database from "../../services/database/db.class";
import { CustomContext } from "../../core/context";

export class Commands extends Command {
  constructor(bot: Telegraf<CustomContext>, redis: Redis, db: Database) {
    super(bot, redis, db);
  }
  //тут пока ниче нет, забей
  handler(): void {
    // this.bot.help(async (ctx) => {
    //   try {
    //     const { id, first_name, username } = ctx.from;
    //     const user = await this.db.getUser(String(id), username, first_name);
    //     ctx.scene.enter("slotStake");
    //   } catch (error) {
    //     console.log(error);
    //   }
    // });
  }
}
