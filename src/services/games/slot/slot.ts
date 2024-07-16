import { Telegraf } from "telegraf";
import Action from "../../../modules/actions/actions.class";
import { CustomContext } from "../../../core/context";
import ru from "../../../localization/ru.json";
import Redis from "../../redis/redis.class";
import Database from "../../database/db.class";
import { sleep } from "../../../utils/helpers";

export class Slot extends Action {
  constructor(bot: Telegraf<CustomContext>, redis: Redis, db: Database) {
    super(bot, redis, db);
  }

  handler(): void {
    this.bot.action(ru.main.slots.spin, async (ctx) => {
      try {
        await this.redis.checkAction(ctx.from.id, ctx);
        const { id, first_name, username } = ctx.from;
        const user = await this.db.getUser(String(id), username, first_name);
        const stakes = await this.db.getStakes();
        const stake = await this.redis.getStake(id);
        const status = await this.redis.getStatus(id);

        let text: string;
        let winAmount: number;

        switch (status) {
          case "demo":
            if (stake > user.demo) {
              return await ctx.answerCbQuery(`🎰Не достаточно средств😢`);
            }
            break;

          case "real":
            if (stake > user.balance) {
              return await ctx.answerCbQuery(`🎰Не достаточно средств😢`);
            }
            break;
          default:
            return;
        }
        await ctx.deleteMessage();

        const slot = await ctx.sendDice({
          emoji: "🎰",
        });
        const dice = slot.dice.value;
        await sleep(4000);

        switch (dice) {
          case 64:
            winAmount = Number(stake) * stakes.jackpot;
            text = `🎉ДЖЕКПОТ🎉\nВыигрыш: ${winAmount}\n\n`;
            break;

          case 43:
            winAmount = Number(stake) * stakes.lemons;
            text = `🍋ЛИМОНЧИКИ🍋\n🎉 Выигрыш: ${winAmount}\n\n`;
            break;

          case 22:
            winAmount = Number(stake) * stakes.berries;
            text = `🍒ЯГОДКИ🍒\n🎉 Выигрыш: ${winAmount}\n\n`;
            break;

          case 1:
            winAmount = Number(stake) * stakes.bar;
            text = `🍸КОКТЕЛЬЧИКИ🍸\n🎉 Выигрыш: ${winAmount}\n\n`;
            break;

          default:
            text = `🎰 К сожалению не повезло😢\n🗿 Выигрыш: 0\n\n`;
            winAmount = 0;
            break;
        }
        switch (status) {
          case "demo":
            text += `${ru.main.demo} ${user.demo - stake + winAmount}🍬\n\n${
              ru.main.slots.stake
            }`;
            await this.db.updateUserDemo(
              user.id,
              user.demo + winAmount - Number(stake)
            );
            break;

          case "real":
            text += `${ru.main.real} ${user.balance - stake + winAmount}💸\n\n${
              ru.main.slots.stake
            }`;
            await this.db.updateUserBalance(
              user.id,
              user.balance + winAmount - Number(stake)
            );
            break;
          default:
            return;
        }

        const message = await ctx.replyWithHTML(text, {
          reply_markup: this.keyboardService.slots(stake),
        });
        await this.redis.saveAction(ctx.from.id, message);
      } catch (error) {
        console.log("Ошибка при action + slot", error);
      }
    });
  }
}
