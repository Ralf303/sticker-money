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
exports.Slot = void 0;
const actions_class_1 = __importDefault(require("../../../modules/actions/actions.class"));
const ru_json_1 = __importDefault(require("../../../localization/ru.json"));
const helpers_1 = require("../../../utils/helpers");
class Slot extends actions_class_1.default {
    constructor(bot, redis, db) {
        super(bot, redis, db);
    }
    handler() {
        this.bot.action(ru_json_1.default.main.slots.spin, (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redis.checkAction(ctx.from.id, ctx);
                const { id, first_name, username } = ctx.from;
                const user = yield this.db.getUser(String(id), username, first_name);
                const stake = yield this.redis.getStake(id);
                const status = yield this.redis.getStatus(id);
                let text;
                let winAmount;
                switch (status) {
                    case "demo":
                        if (stake > user.demo) {
                            return yield ctx.answerCbQuery(`🎰Не достаточно средств😢`);
                        }
                        break;
                    case "real":
                        if (stake > user.balance) {
                            return yield ctx.answerCbQuery(`🎰Не достаточно средств😢`);
                        }
                        break;
                    default:
                        return;
                }
                yield ctx.deleteMessage();
                const slot = yield ctx.sendDice({
                    emoji: "🎰",
                });
                const dice = slot.dice.value;
                yield (0, helpers_1.sleep)(2300);
                switch (dice) {
                    case 64:
                        winAmount = Number(stake) * 15;
                        text = `🎉ДЖЕКПОТ🎉\nВыигрыш: ${winAmount}\n\n`;
                        break;
                    case 43:
                        winAmount = Number(stake) * 10;
                        text = `🍋ЛИМОНЧИКИ🍋\n✅ Выигрыш: ${winAmount}\n\n`;
                        break;
                    case 22:
                        winAmount = Number(stake) * 8;
                        text = `🍒ЯГОДКИ🍒\n✅ Выигрыш: ${winAmount}\n\n`;
                        break;
                    case 1:
                        winAmount = Number(stake) * 5;
                        text = `🍸КОКТЕЛЬЧИК🍸\n✅ Выигрыш: ${winAmount}\n\n`;
                        break;
                    default:
                        text = `🎰К сожалению не повезло😢\n🗿 Выигрыш: 0\n\n`;
                        winAmount = 0;
                        break;
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
                    reply_markup: this.keyboardService.slots(stake),
                });
                yield this.redis.saveAction(ctx.from.id, message);
            }
            catch (error) {
                console.log("Ошибка при action + slot", error);
            }
        }));
    }
}
exports.Slot = Slot;
