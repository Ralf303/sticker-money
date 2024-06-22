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
exports.StartActions = void 0;
const actions_class_1 = __importDefault(require("./actions-class"));
const ru_json_1 = __importDefault(require("../../localization/ru.json"));
class StartActions extends actions_class_1.default {
    constructor(bot, redis, db) {
        super(bot, redis, db);
    }
    handler() {
        this.bot.action(ru_json_1.default.buttons.start, (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redis.checkAction(String(ctx.from.id), ctx);
                yield ctx.deleteMessage();
                const message = yield ctx.replyWithHTML(ru_json_1.default.main.games, {
                    reply_markup: this.keyboardService.games(),
                });
                yield this.redis.saveAction(String(ctx.from.id), message);
            }
            catch (error) {
                console.log("Ошибка при action start", error);
            }
        }));
        this.bot.action(ru_json_1.default.buttons.back, (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redis.checkAction(String(ctx.from.id), ctx);
                yield ctx.deleteMessage();
                const message = yield ctx.replyWithHTML(ru_json_1.default.main.main, {
                    reply_markup: this.keyboardService.main(),
                });
                yield this.redis.saveAction(String(ctx.from.id), message);
            }
            catch (error) {
                console.log("Ошибка при action back", error);
            }
        }));
    }
}
exports.StartActions = StartActions;
