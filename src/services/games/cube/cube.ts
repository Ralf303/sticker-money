import { Telegraf } from "telegraf";
import Action from "../../../modules/actions/actions.class";
import { CustomContext } from "../../../core/context";
import ru from "../../../localization/ru.json";
import Redis from "../../redis/redis.class";
import Database from "../../database/db.class";
import { sleep, getEmojiNumber } from "../../../utils/helpers";

export class Cube extends Action {
  constructor(bot: Telegraf<CustomContext>, redis: Redis, db: Database) {
    super(bot, redis, db);
  }

  handler(): void {
    this.bot.action(ru.main.сube.spin, async (ctx) => {
      try {
        await this.redis.checkAction(ctx.from.id, ctx);
        const { id, first_name, username } = ctx.from;
        const user = await this.db.getUser(String(id), username, first_name);
        const stake = await this.redis.getStake(id);
        const stakes = await this.db.getStakes();
        const status = await this.redis.getStatus(id);
        const option = await this.redis.getOption(id);

        let text: string;
        let winAmount: number;

        switch (status) {
          case "demo":
            if (stake > user.demo) {
              return await ctx.answerCbQuery(`🎲Не достаточно средств😢`);
            }
            break;

          case "real":
            if (stake > user.balance) {
              return await ctx.answerCbQuery(`🎲Не достаточно средств😢`);
            }
            break;
          default:
            return;
        }

        await ctx.deleteMessage();
        const slot = await ctx.sendDice({
          emoji: "🎲",
        });
        const dice = slot.dice.value;
        await sleep(4000);

        if (option === "Четный" && dice % 2 === 0) {
          winAmount = Number(stake) * stakes.odd;
          text = `${getEmojiNumber(
            dice
          )} - Четный\n🎉 Выигрыш: ${winAmount}\n\n`;
        } else if (option === "Нечетный" && dice % 2 != 0) {
          winAmount = Number(stake) * stakes.odd;
          text = `${getEmojiNumber(
            dice
          )} - Нечетный\n🎉 Выигрыш: ${winAmount}\n\n`;
        } else if (Number(option) === dice) {
          winAmount = Number(stake) * stakes.correct;
          text = `${getEmojiNumber(
            dice
          )} - Совпал\n🎉 Выигрыш: ${winAmount}\n\n`;
        } else {
          winAmount = 0;
          text = `${getEmojiNumber(
            dice
          )} - Не угадал😢\n🗿 Выигрыш: ${winAmount}\n\n`;
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
            await this.db.setLogs(
              "cube",
              user.chatId,
              `Юзер сыграл в куб, ставка ${stake}, выйгрыш ${winAmount}, итоговый баланс ${
                user.balance + winAmount - Number(stake)
              }`
            );
            break;
          default:
            return;
        }

        const message = await ctx.replyWithHTML(text, {
          reply_markup: this.keyboardService.cube(stake, option),
        });
        await this.redis.saveAction(ctx.from.id, message);
      } catch (error) {
        console.log("Ошибка при action + slot", error);
      }
    });
  }
}
