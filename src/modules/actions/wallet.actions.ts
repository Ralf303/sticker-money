import { Telegraf, Scenes } from "telegraf";
import Action from "./actions.class";
import ru from "../../localization/ru.json";
import Redis from "../../services/redis/redis.class";
import Database from "../../services/database/db.class";
import { CustomContext } from "../../core/context";
import { IConfigService } from "../../config/config.interface";
import ConfigService from "../../config/config.service";

export class WaletActions extends Action {
  private configService: IConfigService;

  constructor(bot: Telegraf<CustomContext>, redis: Redis, db: Database) {
    super(bot, redis, db);
    this.configService = new ConfigService();
  }

  handler(): void {
    this.bot.action(ru.buttons.balance.demo, async (ctx) => {
      try {
        await ctx.scene.leave();
        const { id, first_name, username } = ctx.from;
        await this.redis.checkAction(id, ctx);
        const isDemo = await this.redis.getDemo(id);

        if (isDemo) {
          return await ctx.answerCbQuery(ru.alets.noDemo);
        }

        const user = await this.db.getUser(String(id), username, first_name);

        if (user.demo > 50) {
          return await ctx.answerCbQuery(ru.alets.manyDemo);
        }

        await this.db.updateUserDemo(user.id, user.demo + 1000);
        await this.redis.setDemo(id);
        await ctx.answerCbQuery(ru.alets.demoSuccess);
        await ctx.editMessageText(
          `${ru.main.balance.start}${user.balance} ${ru.main.balance.real}${
            user.demo + 1000
          } ${ru.main.balance.demo}`,
          {
            reply_markup: this.keyboardService.balance(),
          }
        );
      } catch (error) {
        console.log("Ошибка при action demo", error);
      }
    });

    this.bot.action(ru.buttons.balance.down, async (ctx) => {
      try {
        await ctx.scene.leave();
        const { id, first_name, username } = ctx.from;
        await this.redis.checkAction(id, ctx);
        const user = await this.db.getUser(String(id), username, first_name);

        if (user.balance < 250) {
          return await ctx.answerCbQuery(ru.alets.noMoney);
        }

        await ctx.deleteMessage();
        await ctx.scene.enter("amount");
      } catch (error) {
        console.log("Ошибка при action на выводе", error);
      }
    });

    this.bot.action(ru.buttons.balance.up, async (ctx) => {
      try {
        await ctx.deleteMessage();
        await ctx.scene.leave();
        const { id } = ctx.from;
        await this.redis.checkAction(id, ctx);
        const link = await this.redis.getOrder(id);

        if (link.length < 1) {
          return await ctx.scene.enter("upAmount");
        }

        const message = await ctx.reply(
          `У тебя не оплаченный заказ\n\nОплати его по ссылке: ${link}\n\nили подожди 20 минут для создания нового`,
          { reply_markup: this.keyboardService.back() }
        );

        await this.redis.saveAction(id, message);
      } catch (error) {
        console.log("Ошибка при action на пополнении", error);
      }
    });

    this.bot.action(ru.buttons.balance.check.retry, async (ctx) => {
      try {
        await ctx.scene.leave();
        const { id, first_name, username } = ctx.from;
        await this.redis.checkAction(id, ctx);
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
      } catch (error) {
        console.log("Ошибка при action на выводе", error);
      }
    });

    this.bot.action(/^down\w+\d+$/, async (ctx) => {
      try {
        await ctx.scene.leave();
        const { id, first_name, username } = ctx.from;
        await this.redis.checkAction(id, ctx);
        //@ts-ignore
        const data = ctx.callbackQuery.data.split("_");
        const [_, card, amount] = data;
        const commision = Math.floor(amount - (amount * 10) / 100);
        const channelId = this.configService.get("CHANNEL_ID");
        const user = await this.db.getUser(String(id), username, first_name);
        await ctx.deleteMessage();
        await this.db.updateUserBalance(user.id, user.balance - Number(amount));
        const message = await ctx.reply(ru.main.balance.down.success, {
          reply_markup: this.keyboardService.back(),
        });

        await this.redis.saveAction(id, message);
        await ctx.telegram.sendMessage(
          channelId,
          `❗️ЗАЯВКА НА ВЫВОД❗️\n\nНик: <a href="tg://user?id=${id}">${first_name}</a>\nId: <code>${id}</code>\nКарта: <code>${card}</code>\nСумма к выводу: ${commision}`,
          {
            parse_mode: "HTML",
            reply_markup: this.keyboardService.channel(
              String(id),
              String(amount)
            ),
          }
        );
      } catch (error) {
        console.log("Ошибка при action на выводе", error);
      }
    });
  }
}
