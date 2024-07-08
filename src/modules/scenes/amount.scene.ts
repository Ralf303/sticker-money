import { Scenes } from "telegraf";
import { CustomContext } from "../../core/context";
import Redis from "../../services/redis/redis.class";
import Scene from "./scenes.class";
import Database from "../../services/database/db.class";
import ru from "../../localization/ru.json";

class AmountScene extends Scene {
  private bot: Scenes.BaseScene<CustomContext>;

  constructor(redis: Redis, db: Database) {
    super(redis, db);
    this.bot = new Scenes.BaseScene<CustomContext>("amount");
  }

  public init(): Scenes.BaseScene<CustomContext> {
    this.bot.enter(async (ctx) => {
      try {
        await ctx.reply(ru.main.balance.down.summ);
      } catch (error) {
        console.log(error);
      }
    });

    this.bot.hears(/^\d+$/, async (ctx) => {
      try {
        const amount = parseInt(ctx.message.text);

        if (amount < 250) {
          return await ctx.reply(ru.main.balance.down.summErrLow);
        }

        const { id, first_name, username } = ctx.from;
        const user = await this.db.getUser(String(id), username, first_name);

        if (user.balance < amount) {
          return await ctx.reply(ru.main.balance.down.summErrNoMoney);
        }

        await ctx.scene.enter("card", { amount });
      } catch (error) {
        console.log(error);
      }
    });
    return this.bot;
  }
}

export default AmountScene;
