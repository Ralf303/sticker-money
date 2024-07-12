import { Scenes } from "telegraf";
import { CustomContext } from "../../core/context";
import Redis from "../../services/redis/redis.class";
import Scene from "./scenes.class";
import Database from "../../services/database/db.class";
import ru from "../../localization/ru.json";
import { getLink } from "../../utils/api";

class UpAmountScene extends Scene {
  private bot: Scenes.BaseScene<CustomContext>;

  constructor(redis: Redis, db: Database) {
    super(redis, db);
    this.bot = new Scenes.BaseScene<CustomContext>("upAmount");
  }

  public init(): Scenes.BaseScene<CustomContext> {
    this.bot.enter(async (ctx) => {
      try {
        await ctx.reply(ru.main.balance.up.summ, {
          reply_markup: this.keyboardService.cancel(),
        });
      } catch (error) {
        console.log(error);
      }
    });

    this.bot.hears(/^\d+$/, async (ctx) => {
      try {
        const amount = Number(ctx.message.text);

        if (amount < 300) {
          return await ctx.reply(ru.main.balance.up.summErrLow, {
            reply_markup: this.keyboardService.cancel(),
          });
        }
        const link = await getLink(amount, ctx.from.id);

        if (!link) {
          return await ctx.reply(
            "Сервис оплаты для тебя пока не доступен, подожди пару минут или пополни баланс с помощью поддержки => @StickerMoney_support",
            {
              reply_markup: this.keyboardService.cancel(),
            }
          );
        }

        await this.redis.setOrder(ctx.from.id, link);
        await ctx.reply(
          `Для пополнения счета на ${ctx.message.text}₽ перейдите по <a href="${link}">ссылке</a>.\n\nПосле оплаты твой баланс автоматически будет пополнен.`,
          {
            reply_markup: this.keyboardService.getUrl(link),
            parse_mode: "HTML",
          }
        );
      } catch (error) {
        console.log(error);
      }
    });

    this.bot.action(ru.buttons.cancel, async (ctx) => {
      await ctx.scene.leave();
      const { id, first_name, username } = ctx.from;
      const user = await this.db.getUser(String(id), username, first_name);

      await ctx.answerCbQuery(ru.alets.retry);
      await ctx.deleteMessage();
      const message = await ctx.reply(
        `${ru.main.balance.start}${user.balance} ${ru.main.balance.real}${user.demo} ${ru.main.balance.demo}`,
        {
          reply_markup: this.keyboardService.balance(),
        }
      );
      await this.redis.saveAction(id, message);
    });
    return this.bot;
  }
}

export default UpAmountScene;
