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
exports.StakeActions = void 0;
const actions_class_1 = __importDefault(require("./actions.class"));
const ru_json_1 = __importDefault(require("../../localization/ru.json"));
class StakeActions extends actions_class_1.default {
    constructor(bot, redis, db) {
        super(bot, redis, db);
    }
    handler() {
        this.bot.action("+slot", (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redis.checkAction(ctx.from.id, ctx);
                const { id, first_name, username } = ctx.from;
                const user = yield this.db.getUser(String(id), username, first_name);
                const stake = yield this.redis.getStake(id);
                const status = yield this.redis.getStatus(id);
                let newStake;
                let text;
                yield ctx.deleteMessage();
                switch (status) {
                    case "demo":
                        text = `${ru_json_1.default.main.demo} ${user.demo}🍬\n\n${ru_json_1.default.main.slots.stake}`;
                        newStake = yield this.redis.setStake(id, Math.min(stake + 5, Math.min(user.demo, 1000)));
                        break;
                    case "real":
                        text = `${ru_json_1.default.main.real} ${user.balance}💸\n\n${ru_json_1.default.main.slots.stake}`;
                        newStake = yield this.redis.setStake(id, Math.min(stake + 5, Math.min(user.balance, 1000)));
                        break;
                    default:
                        return;
                }
                const message = yield ctx.replyWithHTML(text, {
                    reply_markup: this.keyboardService.slots(newStake),
                });
                yield this.redis.saveAction(ctx.from.id, message);
            }
            catch (error) {
                console.log("Ошибка при action + slot", error);
            }
        }));
        this.bot.action("-slot", (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redis.checkAction(ctx.from.id, ctx);
                const { id, first_name, username } = ctx.from;
                const user = yield this.db.getUser(String(id), username, first_name);
                const stake = yield this.redis.getStake(id);
                const status = yield this.redis.getStatus(id);
                const newStake = yield this.redis.setStake(id, Math.max(stake - 5, 5));
                let text;
                yield ctx.deleteMessage();
                switch (status) {
                    case "demo":
                        text = `${ru_json_1.default.main.demo} ${user.demo}🍬\n\n${ru_json_1.default.main.slots.stake}`;
                        break;
                    case "real":
                        text = `${ru_json_1.default.main.real} ${user.balance}💸\n\n${ru_json_1.default.main.slots.stake}`;
                        break;
                    default:
                        return;
                }
                const message = yield ctx.replyWithHTML(text, {
                    reply_markup: this.keyboardService.slots(newStake),
                });
                yield this.redis.saveAction(ctx.from.id, message);
            }
            catch (error) {
                console.log("Ошибка при action -slot", error);
            }
        }));
        this.bot.action(`${ru_json_1.default.buttons.stake.min}slot`, (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redis.checkAction(ctx.from.id, ctx);
                const { id, first_name, username } = ctx.from;
                const user = yield this.db.getUser(String(id), username, first_name);
                const status = yield this.redis.getStatus(id);
                const newStake = yield this.redis.setStake(id, 5);
                let text;
                yield ctx.deleteMessage();
                switch (status) {
                    case "demo":
                        text = `${ru_json_1.default.main.demo} ${user.demo}🍬\n\n${ru_json_1.default.main.slots.stake}`;
                        break;
                    case "real":
                        text = `${ru_json_1.default.main.real} ${user.balance}💸\n\n${ru_json_1.default.main.slots.stake}`;
                        break;
                    default:
                        return;
                }
                const message = yield ctx.replyWithHTML(text, {
                    reply_markup: this.keyboardService.slots(newStake),
                });
                yield this.redis.saveAction(ctx.from.id, message);
            }
            catch (error) {
                console.log("Ошибка при action -slot", error);
            }
        }));
        this.bot.action(`${ru_json_1.default.buttons.stake.max}slot`, (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redis.checkAction(ctx.from.id, ctx);
                const { id, first_name, username } = ctx.from;
                const user = yield this.db.getUser(String(id), username, first_name);
                const status = yield this.redis.getStatus(id);
                let newStake;
                let text;
                yield ctx.deleteMessage();
                switch (status) {
                    case "demo":
                        text = `${ru_json_1.default.main.demo} ${user.demo}🍬\n\n${ru_json_1.default.main.slots.stake}`;
                        newStake = yield this.redis.setStake(id, user.demo <= 1000 ? user.demo : 1000);
                        break;
                    case "real":
                        text = `${ru_json_1.default.main.real} ${user.balance}💸\n\n${ru_json_1.default.main.slots.stake}`;
                        newStake = yield this.redis.setStake(id, user.balance * 2 <= 1000 ? user.balance : 1000);
                        break;
                    default:
                        return;
                }
                const message = yield ctx.replyWithHTML(text, {
                    reply_markup: this.keyboardService.slots(newStake),
                });
                yield this.redis.saveAction(ctx.from.id, message);
            }
            catch (error) {
                console.log("Ошибка при action max", error);
            }
        }));
        this.bot.action(`${ru_json_1.default.buttons.stake.double}slot`, (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redis.checkAction(ctx.from.id, ctx);
                const { id, first_name, username } = ctx.from;
                const user = yield this.db.getUser(String(id), username, first_name);
                const status = yield this.redis.getStatus(id);
                const stake = yield this.redis.getStake(id);
                let newStake;
                let text;
                yield ctx.deleteMessage();
                switch (status) {
                    case "demo":
                        text = `${ru_json_1.default.main.demo} ${user.demo}🍬\n\n${ru_json_1.default.main.slots.stake}`;
                        newStake = yield this.redis.setStake(id, Math.min(stake * 2 <= user.demo ? stake * 2 : user.demo, 1000));
                        break;
                    case "real":
                        text = `${ru_json_1.default.main.real} ${user.balance}💸\n\n${ru_json_1.default.main.slots.stake}`;
                        newStake = yield this.redis.setStake(id, Math.min(stake * 2 <= user.balance ? stake * 2 : user.balance, 1000));
                        break;
                    default:
                        return;
                }
                const message = yield ctx.replyWithHTML(text, {
                    reply_markup: this.keyboardService.slots(newStake),
                });
                yield this.redis.saveAction(ctx.from.id, message);
            }
            catch (error) {
                console.log("Ошибка при action double", error);
            }
        }));
    }
}
exports.StakeActions = StakeActions;
