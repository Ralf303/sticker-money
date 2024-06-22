import { Telegraf, Scenes } from "telegraf";
import Action from "./actions.class";
import ru from "../../localization/ru.json";
import Redis from "../../services/redis/redis.class";
import Database from "../../services/database/db.class";
import { CustomContext } from "../../core/context";
//Изивини за говнокод но тут только костыль, либо я тупой
export class SlotStakeActions extends Action {
  constructor(bot: Telegraf<CustomContext>, redis: Redis, db: Database) {
    super(bot, redis, db);
  }

  handler(): void {
    this.bot.action("+slot", async (ctx) => {
      try {
        await this.redis.checkAction(ctx.from.id, ctx);
        const { id, first_name, username } = ctx.from;
        const user = await this.db.getUser(String(id), username, first_name);
        const stake = await this.redis.getStake(id);
        const status = await this.redis.getStatus(id);
        let newStake: number;
        let text: string;
        await ctx.deleteMessage();

        switch (status) {
          case "demo":
            text = `${ru.main.demo} ${user.demo}🍬\n\n${ru.main.slots.stake}`;
            newStake = await this.redis.setStake(
              id,
              Math.min(stake + 5, Math.min(user.demo, 1000))
            );
            break;

          case "real":
            text = `${ru.main.real} ${user.balance}💸\n\n${ru.main.slots.stake}`;
            newStake = await this.redis.setStake(
              id,
              Math.min(stake + 5, Math.min(user.balance, 1000))
            );
            break;
          default:
            return;
        }

        const message = await ctx.replyWithHTML(text, {
          reply_markup: this.keyboardService.slots(newStake),
        });
        await this.redis.saveAction(ctx.from.id, message);
      } catch (error) {
        console.log("Ошибка при action + slot", error);
      }
    });

    this.bot.action("-slot", async (ctx) => {
      try {
        await this.redis.checkAction(ctx.from.id, ctx);
        const { id, first_name, username } = ctx.from;
        const user = await this.db.getUser(String(id), username, first_name);
        const stake = await this.redis.getStake(id);
        const status = await this.redis.getStatus(id);
        const newStake = await this.redis.setStake(id, Math.max(stake - 5, 5));
        let text: string;
        await ctx.deleteMessage();

        switch (status) {
          case "demo":
            text = `${ru.main.demo} ${user.demo}🍬\n\n${ru.main.slots.stake}`;
            break;

          case "real":
            text = `${ru.main.real} ${user.balance}💸\n\n${ru.main.slots.stake}`;
            break;
          default:
            return;
        }

        const message = await ctx.replyWithHTML(text, {
          reply_markup: this.keyboardService.slots(newStake),
        });
        await this.redis.saveAction(ctx.from.id, message);
      } catch (error) {
        console.log("Ошибка при action -slot", error);
      }
    });

    this.bot.action(`${ru.buttons.stake.min}slot`, async (ctx) => {
      try {
        await this.redis.checkAction(ctx.from.id, ctx);
        const { id, first_name, username } = ctx.from;
        const user = await this.db.getUser(String(id), username, first_name);
        const status = await this.redis.getStatus(id);
        const newStake = await this.redis.setStake(id, 5);
        let text: string;
        await ctx.deleteMessage();

        switch (status) {
          case "demo":
            text = `${ru.main.demo} ${user.demo}🍬\n\n${ru.main.slots.stake}`;
            break;

          case "real":
            text = `${ru.main.real} ${user.balance}💸\n\n${ru.main.slots.stake}`;
            break;
          default:
            return;
        }

        const message = await ctx.replyWithHTML(text, {
          reply_markup: this.keyboardService.slots(newStake),
        });
        await this.redis.saveAction(ctx.from.id, message);
      } catch (error) {
        console.log("Ошибка при action min slot", error);
      }
    });

    this.bot.action(`${ru.buttons.stake.max}slot`, async (ctx) => {
      try {
        await this.redis.checkAction(ctx.from.id, ctx);
        const { id, first_name, username } = ctx.from;
        const user = await this.db.getUser(String(id), username, first_name);
        const status = await this.redis.getStatus(id);
        let newStake;
        let text: string;
        await ctx.deleteMessage();

        switch (status) {
          case "demo":
            text = `${ru.main.demo} ${user.demo}🍬\n\n${ru.main.slots.stake}`;
            newStake = await this.redis.setStake(
              id,
              user.demo <= 1000 ? user.demo : 1000
            );
            break;

          case "real":
            text = `${ru.main.real} ${user.balance}💸\n\n${ru.main.slots.stake}`;
            newStake = await this.redis.setStake(
              id,
              user.balance <= 1000 ? user.balance : 1000
            );
            break;
          default:
            return;
        }

        const message = await ctx.replyWithHTML(text, {
          reply_markup: this.keyboardService.slots(newStake),
        });
        await this.redis.saveAction(ctx.from.id, message);
      } catch (error) {
        console.log("Ошибка при action max", error);
      }
    });

    this.bot.action(`${ru.buttons.stake.double}slot`, async (ctx) => {
      try {
        await this.redis.checkAction(ctx.from.id, ctx);
        const { id, first_name, username } = ctx.from;
        const user = await this.db.getUser(String(id), username, first_name);
        const status = await this.redis.getStatus(id);
        const stake = await this.redis.getStake(id);
        let newStake;
        let text: string;
        await ctx.deleteMessage();

        switch (status) {
          case "demo":
            text = `${ru.main.demo} ${user.demo}🍬\n\n${ru.main.slots.stake}`;
            newStake = await this.redis.setStake(
              id,
              Math.min(stake * 2 <= user.demo ? stake * 2 : user.demo, 1000)
            );
            break;

          case "real":
            text = `${ru.main.real} ${user.balance}💸\n\n${ru.main.slots.stake}`;
            newStake = await this.redis.setStake(
              id,
              Math.min(
                stake * 2 <= user.balance ? stake * 2 : user.balance,
                1000
              )
            );
            break;
          default:
            return;
        }

        const message = await ctx.replyWithHTML(text, {
          reply_markup: this.keyboardService.slots(newStake),
        });
        await this.redis.saveAction(ctx.from.id, message);
      } catch (error) {
        console.log("Ошибка при action double", error);
      }
    });
  }
}
