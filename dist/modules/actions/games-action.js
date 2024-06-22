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
exports.GameActions = void 0;
const actions_class_1 = __importDefault(require("./actions.class"));
const ru_json_1 = __importDefault(require("../../localization/ru.json"));
class GameActions extends actions_class_1.default {
    constructor(bot, redis, db) {
        super(bot, redis, db);
    }
    handler() {
        this.bot.action(ru_json_1.default.buttons.games.slots, (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redis.checkAction(ctx.from.id, ctx);
                yield ctx.deleteMessage();
                const message = yield ctx.replyWithHTML(`${ru_json_1.default.main.slots.rules}\n\n${ru_json_1.default.main.choose}`, {
                    reply_markup: this.keyboardService.chooseSlot(),
                });
                yield this.redis.saveAction(ctx.from.id, message);
            }
            catch (error) {
                console.log("Ошибка при action slots", error);
            }
        }));
        this.bot.action(ru_json_1.default.buttons.games.cube, (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redis.checkAction(ctx.from.id, ctx);
                yield ctx.deleteMessage();
                const message = yield ctx.replyWithHTML(`${ru_json_1.default.main.сube.rules}\n\n${ru_json_1.default.main.choose}`, {
                    reply_markup: this.keyboardService.chooseKube(),
                });
                yield this.redis.saveAction(ctx.from.id, message);
            }
            catch (error) {
                console.log("Ошибка при action cube", error);
            }
        }));
        this.bot.action(/\b^demo\b/, (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const { data } = ctx.update.callback_query;
                const [_, mode] = data.split(" ");
                yield ctx.scene.enter(`${mode}Stake`);
                yield this.redis.checkAction(ctx.from.id, ctx);
                const { id, first_name, username } = ctx.from;
                const user = yield this.db.getUser(String(id), username, first_name);
                const stake = yield this.redis.getStake(id);
                yield this.redis.setStatus(id, "demo");
                let text = "";
                let keyboard;
                yield ctx.deleteMessage();
                switch (mode) {
                    case "slot":
                        text = `${ru_json_1.default.main.demo} ${user.demo}🍬\n\n${ru_json_1.default.main.slots.stake}`;
                        keyboard = this.keyboardService.slots(stake);
                        break;
                    case "cube":
                        text = `${ru_json_1.default.main.demo} ${user.demo}🍬\n\n${ru_json_1.default.main.slots.stake}`;
                        keyboard = this.keyboardService.cube(stake);
                        break;
                    default:
                        return;
                }
                const message = yield ctx.replyWithHTML(text, {
                    reply_markup: keyboard,
                });
                yield this.redis.saveAction(ctx.from.id, message);
            }
            catch (error) {
                console.log("Ошибка при action demo", error);
            }
        }));
        this.bot.action(/\b^real\b/, (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const { data } = ctx.update.callback_query;
                const [_, mode] = data.split(" ");
                yield ctx.scene.enter(`${mode}Stake`);
                yield this.redis.checkAction(ctx.from.id, ctx);
                const { id, first_name, username } = ctx.from;
                const user = yield this.db.getUser(String(id), username, first_name);
                const stake = yield this.redis.getStake(id);
                yield this.redis.setStatus(id, "real");
                let text = "";
                let keyboard;
                yield ctx.deleteMessage();
                switch (mode) {
                    case "slot":
                        text = `${ru_json_1.default.main.real} ${user.balance}💸\n\n${ru_json_1.default.main.slots.stake}`;
                        keyboard = this.keyboardService.slots(stake);
                        break;
                    case "cube":
                        text = `${ru_json_1.default.main.real} ${user.balance}💸\n\n${ru_json_1.default.main.slots.stake}`;
                        keyboard = this.keyboardService.cube(stake);
                        break;
                    default:
                        return;
                }
                const message = yield ctx.replyWithHTML(text, {
                    reply_markup: keyboard,
                });
                yield this.redis.saveAction(ctx.from.id, message);
            }
            catch (error) {
                console.log("Ошибка при action real", error);
            }
        }));
    }
}
exports.GameActions = GameActions;
