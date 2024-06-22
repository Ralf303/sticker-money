import { Telegraf, Scenes } from "telegraf";
import KeyboardService from "../../keyboards/keyboard.service";
import Redis from "../../services/redis/redis.class";
import Database from "../../services/database/db.class";
import { CustomContext } from "../../core/context";

export default abstract class Action {
  protected keyboardService: KeyboardService;
  constructor(
    public bot: Telegraf<CustomContext>,
    public redis: Redis,
    public db: Database
  ) {
    this.keyboardService = new KeyboardService();
  }

  abstract handler(): void;
}
