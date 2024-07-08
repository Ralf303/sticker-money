import { Scenes, Telegraf, session } from "telegraf";
import { CustomContext } from "./core/context";
import ConfigService from "./config/config.service";
import Command from "./modules/commands/commands.class";
import Database from "./services/database/db.class";
import Redis from "./services/redis/redis.class";
import Scene from "./modules/scenes/scenes.class";
import Action from "./modules/actions/actions.class";
import { IConfigService } from "./config/config.interface";
import RedisService from "./services/redis/redis.service";
import { DatabaseService } from "./services/database/db.service";
import { Commands } from "./modules/commands/main.commands";
import { StartCommand } from "./modules/commands/start.command";
import { StartActions } from "./modules/actions/main.action";
import { GameActions } from "./modules/actions/games.action";
import { SlotStakeActions } from "./modules/actions/slot.stake.action";
import SlotStakeScene from "./modules/scenes/slotStake.scene";
import CubeStakeScene from "./modules/scenes/cubeStake.scene";
import { CubeStakeActions } from "./modules/actions/cube.stake.action";
import { OptionActions } from "./modules/actions/option.ations";
import { Slot } from "./services/games/slot/slot";
import { Cube } from "./services/games/cube/cube";
import { WaletActions } from "./modules/actions/wallet.actions";
import Server from "./server";
import AmountScene from "./modules/scenes/amount.scene";
import CardScene from "./modules/scenes/card.scene";
import ChannelActions from "./modules/actions/channel.actoins";

class Bot {
  private commands: Command[] = [];
  private actions: Action[] = [];
  private slotScene: Scene;
  private cubeScene: Scene;
  private amountScene: Scene;
  private cardScene: Scene;
  private bot: Telegraf<CustomContext>;

  protected db: Database;
  protected redis: Redis;

  constructor(private configService: IConfigService) {
    this.bot = new Telegraf<CustomContext>(configService.get("BOT_TOKEN"));
    this.db = new DatabaseService();
    this.redis = new RedisService();
    this.slotScene = new SlotStakeScene(this.redis, this.db);
    this.cubeScene = new CubeStakeScene(this.redis, this.db);
    this.amountScene = new AmountScene(this.redis, this.db);
    this.cardScene = new CardScene(this.redis, this.db);
  }

  public async start() {
    this.commands = [
      new Commands(this.bot, this.redis, this.db),
      new StartCommand(this.bot, this.redis, this.db),
    ];
    this.actions = [
      new StartActions(this.bot, this.redis, this.db),
      new GameActions(this.bot, this.redis, this.db),
      new SlotStakeActions(this.bot, this.redis, this.db),
      new CubeStakeActions(this.bot, this.redis, this.db),
      new OptionActions(this.bot, this.redis, this.db),
      new WaletActions(this.bot, this.redis, this.db),
      new Slot(this.bot, this.redis, this.db),
      new Cube(this.bot, this.redis, this.db),
      new ChannelActions(this.bot, this.redis, this.db),
    ];
    await this.db.connect();
    await this.redis.connect();
    const stage = new Scenes.Stage<CustomContext>([
      this.slotScene.init(),
      this.cubeScene.init(),
      this.amountScene.init(),
      this.cardScene.init(),
    ]);
    this.bot.use(session());
    this.bot.use(stage.middleware());
    this.commands.forEach((command) => command.handler());
    this.actions.forEach((action) => action.handler());
    this.bot.catch((error) => console.log(error));
    const server = new Server(this.bot, this.configService);
    await server.start();
  }
}

const bot = new Bot(new ConfigService());
bot.start();
