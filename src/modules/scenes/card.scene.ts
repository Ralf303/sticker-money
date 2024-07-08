import { Scenes } from "telegraf";
import { CustomContext, State } from "../../core/context";
import Redis from "../../services/redis/redis.class";
import Scene from "./scenes.class";
import Database from "../../services/database/db.class";
import ru from "../../localization/ru.json";

class CardScene extends Scene {
  private bot: Scenes.BaseScene<CustomContext>;

  constructor(redis: Redis, db: Database) {
    super(redis, db);
    this.bot = new Scenes.BaseScene<CustomContext>("card");
  }

  public init(): Scenes.BaseScene<CustomContext> {
    this.bot.enter(async (ctx) => {
      try {
        await ctx.reply(ru.main.balance.down.cardRequest);
      } catch (error) {
        console.log(error);
      }
    });

    this.bot.hears(/^\d+$/, async (ctx) => {
      try {
        const card = ctx.message.text;
        const amount = (ctx.scene.session.state as State)?.amount || 250;
        const commision = Math.floor(amount - (amount * 10) / 100);
        const { id } = ctx.from;
        const message = `${ru.main.balance.down.cardSuccess.start}${ru.main.balance.down.cardSuccess.amount}${amount}${ru.main.balance.down.cardSuccess.commission}10%${ru.main.balance.down.cardSuccess.total}${commision}${ru.main.balance.down.cardSuccess.card}${card}${ru.main.balance.down.cardSuccess.check}`;
        const form = await ctx.reply(message, {
          reply_markup: this.keyboardService.down(String(card), amount),
        });
        await this.redis.saveAction(id, form);
        await ctx.scene.leave();
      } catch (error) {
        console.log(error);
      }
    });
    return this.bot;
  }
}

export default CardScene;
