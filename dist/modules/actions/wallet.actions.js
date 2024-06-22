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
exports.WaletActions = void 0;
const actions_class_1 = __importDefault(require("./actions.class"));
const ru_json_1 = __importDefault(require("../../localization/ru.json"));
class WaletActions extends actions_class_1.default {
    constructor(bot, redis, db) {
        super(bot, redis, db);
    }
    handler() {
        this.bot.action(ru_json_1.default.buttons.balance.demo, (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield ctx.scene.leave();
                yield this.redis.checkAction(ctx.from.id, ctx);
                const { id, first_name, username } = ctx.from;
                const user = yield this.db.getUser(String(id), username, first_name);
                if (user.balance > 50) {
                    return yield ctx.answerCbQuery("У тебя и так много конфет");
                }
                yield this.db.updateUserDemo(user.id, user.balance + 1000);
                return yield ctx.answerCbQuery("Демо баланс пополнен");
            }
            catch (error) {
                console.log("Ошибка при action walet", error);
            }
        }));
    }
}
exports.WaletActions = WaletActions;
