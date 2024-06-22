import { Scenes } from "telegraf";
import { CustomContext } from "../../core/context";
import Redis from "../../services/redis/redis.class";
import Scene from "./scenes.class";
import Database from "../../services/database/db.class";
import ru from "../../localization/ru.json";

class CubeStakeScene extends Scene {
  private bot: Scenes.BaseScene<CustomContext>;

  constructor(redis: Redis, db: Database) {
    super(redis, db);
    this.bot = new Scenes.BaseScene<CustomContext>("cubeStake");
  }

  public init(): Scenes.BaseScene<CustomContext> {
    this.bot.hears(/\b([5-9]|[1-9][0-9]|[1-9][0-9]{2}|1000)\b/, async (ctx) => {
      try {
        await ctx.deleteMessage();
        const { id, first_name, username } = ctx.from;
        const user = await this.db.getUser(String(id), username, first_name);
        const newStake: number = Number(ctx.match[0]);
        const status: string = await this.redis.getStatus(id);
        const options: string = await this.redis.getOption(id);
        const action = await this.redis.getAction(id);
        let text: string = "";

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

        if (newStake > user.demo) return;
        await this.redis.setStake(id, newStake);
        if (action) {
          await ctx.editMessageText(
            `${text}`,

            {
              reply_markup: this.keyboardService.cube(newStake, options),
              // @ts-ignore
              chat_id: ctx.chat.id,
              message_id: Number(action),
            }
          );
        }
      } catch (error) {
        console.log(error);
      }
    });
    return this.bot;
  }
}

export default CubeStakeScene;
