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
exports.Cube = void 0;
const actions_class_1 = __importDefault(require("../../../modules/actions/actions.class"));
const ru_json_1 = __importDefault(require("../../../localization/ru.json"));
const helpers_1 = require("../../../utils/helpers");
class Cube extends actions_class_1.default {
    constructor(bot, redis, db) {
        super(bot, redis, db);
    }
    handler() {
        this.bot.action(ru_json_1.default.main.сube.spin, (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redis.checkAction(ctx.from.id, ctx);
                const { id, first_name, username } = ctx.from;
                const user = yield this.db.getUser(String(id), username, first_name);
                const stake = yield this.redis.getStake(id);
                const status = yield this.redis.getStatus(id);
                const option = yield this.redis.getOption(id);
                let text;
                let winAmount;
                switch (status) {
                    case "demo":
                        if (stake > user.demo) {
                            return yield ctx.answerCbQuery(`🎲Не достаточно средств😢`);
                        }
                        break;
                    case "real":
                        if (stake > user.balance) {
                            return yield ctx.answerCbQuery(`🎲Не достаточно средств😢`);
                        }
                        break;
                    default:
                        return;
                }
                yield ctx.deleteMessage();
                const slot = yield ctx.sendDice({
                    emoji: "🎲",
                });
                const dice = slot.dice.value;
                yield (0, helpers_1.sleep)(3500);
                if (option === "Четный" && dice % 2 === 0) {
                    winAmount = Number(stake) * 2;
                    text = `${(0, helpers_1.getEmojiNumber)(dice)} - Четный\n✅ Выигрыш: ${winAmount}\n\n`;
                }
                else if (option === "Нечетный" && dice % 2 != 0) {
                    winAmount = Number(stake) * 2;
                    text = `${(0, helpers_1.getEmojiNumber)(dice)} - Нечетный\n✅ Выигрыш: ${winAmount}\n\n`;
                }
                else if (Number(option) === dice) {
                    winAmount = Number(stake) * 2;
                    text = `${(0, helpers_1.getEmojiNumber)(dice)} - Совпал\n✅ Выигрыш: ${winAmount}\n\n`;
                }
                else {
                    winAmount = 0;
                    text = `${(0, helpers_1.getEmojiNumber)(dice)} - Не угадал😢\n✅ Выигрыш: ${winAmount}\n\n`;
                }
                switch (status) {
                    case "demo":
                        text += `${ru_json_1.default.main.demo} ${user.demo - stake + winAmount}🍬\n\n${ru_json_1.default.main.slots.stake}`;
                        yield this.db.updateUserDemo(user.id, user.demo + winAmount - Number(stake));
                        break;
                    case "real":
                        text += `${ru_json_1.default.main.real} ${user.balance - stake + winAmount}💸\n\n${ru_json_1.default.main.slots.stake}`;
                        yield this.db.updateUserBalance(user.id, user.balance + winAmount - Number(stake));
                        break;
                    default:
                        return;
                }
                const message = yield ctx.replyWithHTML(text, {
                    reply_markup: this.keyboardService.cube(stake, option),
                });
                yield this.redis.saveAction(ctx.from.id, message);
            }
            catch (error) {
                console.log("Ошибка при action + slot", error);
            }
        }));
    }
}
exports.Cube = Cube;
