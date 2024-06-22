import { Telegraf, Scenes } from "telegraf";
import KeyboardService from "../../keyboards/keyboard.service";
import Redis from "../../services/redis/redis.class";
import Database from "../../services/database/db.class";
import { CustomContext } from "../../core/context";

export default abstract class Scene {
  protected keyboardService: KeyboardService;

  constructor(protected redis: Redis, protected db: Database) {
    this.keyboardService = new KeyboardService();
  }
  abstract init(): Scenes.BaseScene<CustomContext>;
}
