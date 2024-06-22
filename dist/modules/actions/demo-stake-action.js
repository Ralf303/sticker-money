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
const actions_class_1 = __importDefault(require("./actions-class"));
const ru_json_1 = __importDefault(require("../../localization/ru.json"));
class StakeActions extends actions_class_1.default {
    constructor(bot, redis, db) {
        super(bot, redis, db);
    }
    handler() {
        this.bot.action(/\b\+demo\b/, (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(1234);
                // await this.redis.checkAction(ctx.from.id, ctx);
                // const { id, first_name, username } = ctx.from;
                // const user = await this.db.getUser(String(id), username, first_name);
                // const stake = await this.redis.getStake(id);
                // const newStake = await this.redis.setStake(
                //   id,
                //   Math.min(stake + 5, Math.min(user.demo, 1000))
                // );
                // await ctx.deleteMessage();
                // const message = await ctx.replyWithHTML(
                //   `${ru.main.demo} ${user.demo}🍬\n\n${ru.main.slots.stake}`,
                //   {
                //     reply_markup: this.keyboardService.slots(newStake, "demo"),
                //   }
                // );
                // await this.redis.saveAction(ctx.from.id, message);
            }
            catch (error) {
                console.log("Ошибка при action + slot", error);
            }
        }));
        this.bot.action("- slot demo", (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redis.checkAction(ctx.from.id, ctx);
                const { id, first_name, username } = ctx.from;
                const user = yield this.db.getUser(String(id), username, first_name);
                const stake = yield this.redis.getStake(id);
                const newStake = yield this.redis.setStake(id, Math.max(stake - 5, 5));
                yield ctx.deleteMessage();
                const message = yield ctx.replyWithHTML(`${ru_json_1.default.main.demo} ${user.demo}🍬\n\n${ru_json_1.default.main.slots.stake}`, {
                    reply_markup: this.keyboardService.slots(newStake, "demo"),
                });
                yield this.redis.saveAction(ctx.from.id, message);
            }
            catch (error) {
                console.log("Ошибка при action - slot", error);
            }
        }));
        this.bot.action(`${ru_json_1.default.buttons.stake.min} slot demo`, (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redis.checkAction(ctx.from.id, ctx);
                const { id, first_name, username } = ctx.from;
                const user = yield this.db.getUser(String(id), username, first_name);
                const newStake = yield this.redis.setStake(id, 5);
                yield ctx.deleteMessage();
                const message = yield ctx.replyWithHTML(`${ru_json_1.default.main.demo} ${user.demo}🍬\n\n${ru_json_1.default.main.slots.stake}`, {
                    reply_markup: this.keyboardService.slots(newStake, "demo"),
                });
                yield this.redis.saveAction(ctx.from.id, message);
            }
            catch (error) {
                console.log("Ошибка при action + slot", error);
            }
        }));
        this.bot.action(`${ru_json_1.default.buttons.stake.max} slot demo`, (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redis.checkAction(ctx.from.id, ctx);
                const { id, first_name, username } = ctx.from;
                const user = yield this.db.getUser(String(id), username, first_name);
                const newStake = yield this.redis.setStake(id, user.demo < 1000 ? user.demo : 1000);
                yield ctx.deleteMessage();
                const message = yield ctx.replyWithHTML(`${ru_json_1.default.main.demo} ${user.demo}🍬\n\n${ru_json_1.default.main.slots.stake}`, {
                    reply_markup: this.keyboardService.slots(newStake, "demo"),
                });
                yield this.redis.saveAction(ctx.from.id, message);
            }
            catch (error) {
                console.log("Ошибка при action + slot", error);
            }
        }));
        this.bot.action(`${ru_json_1.default.buttons.stake.double} slot demo`, (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redis.checkAction(ctx.from.id, ctx);
                const { id, first_name, username } = ctx.from;
                const user = yield this.db.getUser(String(id), username, first_name);
                const stake = yield this.redis.getStake(id);
                const newStake = yield this.redis.setStake(id, Math.min(stake * 2, Math.min(user.demo, 1000)));
                yield ctx.deleteMessage();
                const message = yield ctx.replyWithHTML(`${ru_json_1.default.main.demo} ${user.demo}🍬\n\n${ru_json_1.default.main.slots.stake}`, {
                    reply_markup: this.keyboardService.slots(newStake, "demo"),
                });
                yield this.redis.saveAction(ctx.from.id, message);
            }
            catch (error) {
                console.log("Ошибка при action + slot", error);
            }
        }));
    }
}
exports.StakeActions = StakeActions;
