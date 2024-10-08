import { Telegraf } from "telegraf";
import { CustomContext } from "../../core/context";
import Redis from "../../services/redis/redis.class";
import Database from "../../services/database/db.class";
import Action from "./actions.class";

export class ChannelActions extends Action {
  constructor(bot: Telegraf<CustomContext>, redis: Redis, db: Database) {
    super(bot, redis, db);
  }

  handler(): void {
    this.bot.action(/^wrong\w+\d+$/, async (ctx) => {
      try {
        //@ts-ignore
        const [_, id, amount] = ctx.callbackQuery.data.split("_");
        const user = await this.db.getUser(id);
        await this.db.updateUserBalance(user.id, user.balance + Number(amount));
        await ctx.editMessageText(
          `❌Заявка юзера ${user.firstName} была упешно отменена админом ${ctx.from.first_name}❌\nСумма: ${amount}\n\n#отмена`
        );
        await ctx.telegram.sendMessage(
          id,
          "Заявка была отменена, средства вернулись"
        );
        await this.db.setLogs(
          "down",
          user.chatId,
          `Заявка юзера ${user.firstName} была упешно отменена админом ${ctx.from.first_name}\nСумма: ${amount}`
        );
      } catch (error) {
        console.log("Ошибка при отмене средств", error);
      }
    });

    this.bot.action(/^done\w+\d+$/, async (ctx) => {
      try {
        //@ts-ignore
        const [_, id, amount] = ctx.callbackQuery.data.split("_");
        const user = await this.db.getUser(id);
        await ctx.editMessageText(
          `✅Вывод юзера ${user.firstName} был упешно выволнен ${ctx.from.first_name}✅\nСумма: ${amount}\n\n#выводы`
        );
        await this.db.setLogs(
          "down",
          user.chatId,
          `Вывод юзера ${user.firstName} был упешно выволнен ${ctx.from.first_name}\nСумма: ${amount}`
        );
      } catch (error) {
        console.log("Ошибка при выводе средств", error);
      }
    });
  }
}

export default ChannelActions;
