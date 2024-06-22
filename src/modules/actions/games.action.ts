import { Telegraf } from "telegraf";
import Action from "./actions.class";
import ru from "../../localization/ru.json";
import Redis from "../../services/redis/redis.class";
import Database from "../../services/database/db.class";
import { CustomContext } from "../../core/context";

export class GameActions extends Action {
  constructor(bot: Telegraf<CustomContext>, redis: Redis, db: Database) {
    super(bot, redis, db);
  }

  handler(): void {
    this.bot.action(ru.buttons.games.slots, async (ctx) => {
      try {
        await this.redis.checkAction(ctx.from.id, ctx);
        await ctx.deleteMessage();
        const message = await ctx.replyWithHTML(
          `${ru.main.slots.rules}\n\n${ru.main.choose}`,
          {
            reply_markup: this.keyboardService.chooseSlot(),
          }
        );
        await this.redis.saveAction(ctx.from.id, message);
      } catch (error) {
        console.log("Ошибка при action slots", error);
      }
    });

    this.bot.action(ru.buttons.games.cube, async (ctx) => {
      try {
        await this.redis.checkAction(ctx.from.id, ctx);
        await ctx.deleteMessage();
        const message = await ctx.replyWithHTML(
          `${ru.main.сube.rules}\n\n${ru.main.choose}`,
          {
            reply_markup: this.keyboardService.chooseKube(),
          }
        );
        await this.redis.saveAction(ctx.from.id, message);
      } catch (error) {
        console.log("Ошибка при action cube", error);
      }
    });

    this.bot.action(/\b^demo\b/, async (ctx) => {
      try {
        // @ts-ignore
        const { data } = ctx.update.callback_query;
        const [_, mode] = data.split(" ");
        await ctx.scene.enter(`${mode}Stake`);
        await this.redis.checkAction(ctx.from.id, ctx);
        const { id, first_name, username } = ctx.from;
        const user = await this.db.getUser(String(id), username, first_name);
        const stake = await this.redis.getStake(id);
        const options: string = await this.redis.getOption(id);
        await this.redis.setStatus(id, "demo");
        let text = "";
        let keyboard;
        await ctx.deleteMessage();

        switch (mode) {
          case "slot":
            text = `${ru.main.demo} ${user.demo}🍬\n\n${ru.main.slots.stake}`;
            keyboard = this.keyboardService.slots(stake);
            break;

          case "cube":
            text = `${ru.main.demo} ${user.demo}🍬\n\n${ru.main.slots.stake}`;
            keyboard = this.keyboardService.cube(stake, options);
            break;
          default:
            return;
        }

        const message = await ctx.replyWithHTML(text, {
          reply_markup: keyboard,
        });
        await this.redis.saveAction(ctx.from.id, message);
      } catch (error) {
        console.log("Ошибка при action demo", error);
      }
    });

    this.bot.action(/\b^real\b/, async (ctx) => {
      try {
        // @ts-ignore
        const { data } = ctx.update.callback_query;
        const [_, mode] = data.split(" ");
        await ctx.scene.enter(`${mode}Stake`);
        await this.redis.checkAction(ctx.from.id, ctx);
        const { id, first_name, username } = ctx.from;
        const user = await this.db.getUser(String(id), username, first_name);
        const stake = await this.redis.getStake(id);
        const options: string = await this.redis.getOption(id);
        await this.redis.setStatus(id, "real");
        let text = "";
        let keyboard;
        await ctx.deleteMessage();

        switch (mode) {
          case "slot":
            text = `${ru.main.real} ${user.balance}💸\n\n${ru.main.slots.stake}`;
            keyboard = this.keyboardService.slots(stake);
            break;

          case "cube":
            text = `${ru.main.real} ${user.balance}💸\n\n${ru.main.slots.stake}`;
            keyboard = this.keyboardService.cube(stake, options);
            break;
          default:
            return;
        }

        const message = await ctx.replyWithHTML(text, {
          reply_markup: keyboard,
        });
        await this.redis.saveAction(ctx.from.id, message);
      } catch (error) {
        console.log("Ошибка при action real", error);
      }
    });
  }
}
