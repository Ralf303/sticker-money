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
exports.OptionActions = void 0;
const actions_class_1 = __importDefault(require("./actions.class"));
const ru_json_1 = __importDefault(require("../../localization/ru.json"));
class OptionActions extends actions_class_1.default {
    constructor(bot, redis, db) {
        super(bot, redis, db);
    }
    handler() {
        this.bot.action(/^(?:Четный|Нечетный|[1-6])$/, (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redis.checkAction(ctx.from.id, ctx);
                //@ts-ignore
                const { data } = ctx.update.callback_query;
                yield this.redis.checkAction(ctx.from.id, ctx);
                const { id, first_name, username } = ctx.from;
                const user = yield this.db.getUser(String(id), username, first_name);
                const status = yield this.redis.getStatus(id);
                yield this.redis.setOption(id, data);
                const stake = yield this.redis.getStake(id);
                let text;
                yield ctx.deleteMessage();
                switch (status) {
                    case "demo":
                        text = `${ru_json_1.default.main.demo} ${user.demo}🍬\n\n${ru_json_1.default.main.сube.stake}`;
                        break;
                    case "real":
                        text = `${ru_json_1.default.main.real} ${user.balance}💸\n\n${ru_json_1.default.main.сube.stake}`;
                        break;
                    default:
                        return;
                }
                const message = yield ctx.replyWithHTML(text, {
                    reply_markup: this.keyboardService.cube(stake, data),
                });
                yield this.redis.saveAction(ctx.from.id, message);
            }
            catch (e) {
                console.log(e);
            }
        }));
    }
}
exports.OptionActions = OptionActions;
