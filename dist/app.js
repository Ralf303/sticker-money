"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const config_service_1 = __importDefault(require("./config/config.service"));
const redis_service_1 = __importDefault(require("./services/redis/redis.service"));
const db_service_1 = require("./services/database/db.service");
const main_commands_1 = require("./modules/commands/main.commands");
const start_command_1 = require("./modules/commands/start.command");
const main_action_1 = require("./modules/actions/main.action");
const games_action_1 = require("./modules/actions/games.action");
const slot_stake_action_1 = require("./modules/actions/slot.stake.action");
const slotStake_scene_1 = __importDefault(require("./modules/scenes/slotStake.scene"));
const cubeStake_scene_1 = __importDefault(require("./modules/scenes/cubeStake.scene"));
const cube_stake_action_1 = require("./modules/actions/cube.stake.action");
const option_ations_1 = require("./modules/actions/option.ations");
const slot_1 = require("./services/games/slot/slot");
const cube_1 = require("./services/games/cube/cube");
const wallet_actions_1 = require("./modules/actions/wallet.actions");
const server_1 = __importDefault(require("./server"));
class Bot {
    constructor(configService) {
        this.configService = configService;
        this.commands = [];
        this.actions = [];
        this.bot = new telegraf_1.Telegraf(configService.get("BOT_TOKEN"));
        this.db = new db_service_1.DatabaseService();
        this.redis = new redis_service_1.default();
        this.slotScene = new slotStake_scene_1.default(this.redis, this.db);
        this.cubeScene = new cubeStake_scene_1.default(this.redis, this.db);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.commands = [
                new main_commands_1.Commands(this.bot, this.redis, this.db),
                new start_command_1.StartCommand(this.bot, this.redis, this.db),
            ];
            this.actions = [
                new main_action_1.StartActions(this.bot, this.redis, this.db),
                new games_action_1.GameActions(this.bot, this.redis, this.db),
                new slot_stake_action_1.SlotStakeActions(this.bot, this.redis, this.db),
                new cube_stake_action_1.CubeStakeActions(this.bot, this.redis, this.db),
                new option_ations_1.OptionActions(this.bot, this.redis, this.db),
                new wallet_actions_1.WaletActions(this.bot, this.redis, this.db),
                new slot_1.Slot(this.bot, this.redis, this.db),
                new cube_1.Cube(this.bot, this.redis, this.db),
            ];
            yield this.db.connect();
            yield this.redis.connect();
            const stage = new telegraf_1.Scenes.Stage([
                this.slotScene.init(),
                this.cubeScene.init(),
            ]);
            this.bot.use((0, telegraf_1.session)());
            this.bot.use(stage.middleware());
            this.commands.forEach((command) => command.handler());
            this.actions.forEach((action) => action.handler());
            this.bot.catch((error) => console.log(error));
            const server = new server_1.default(this.bot, this.configService);
            yield server.start();
        });
    }
}
const bot = new Bot(new config_service_1.default());
bot.start();
