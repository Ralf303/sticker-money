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
const scenes_class_1 = __importDefault(require("./scenes-class"));
const ru_json_1 = __importDefault(require("../../localization/ru.json"));
class SlotStakeScene extends scenes_class_1.default {
    constructor(redis, db) {
        super(redis, db);
        this.bot = new telegraf_1.Scenes.BaseScene("slotStake");
    }
    init() {
        this.bot.hears(/\b([5-9]|[1-9][0-9]|[1-9][0-9]{2}|1000)\b/, (ctx) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield ctx.deleteMessage();
                const { id, first_name, username } = ctx.from;
                const user = yield this.db.getUser(String(id), username, first_name);
                const newStake = Number(ctx.match[0]);
                const status = yield this.redis.getStatus(id);
                const action = yield this.redis.getAction(id);
                if (newStake > user.demo)
                    return;
                if (action) {
                    yield ctx.editMessageText(`${ru_json_1.default.main.demo} ${user.demo}🍬\n\n${ru_json_1.default.main.stake}`, {
                        reply_markup: this.keyboardService.slots(newStake, "demo"),
                        // @ts-ignore
                        chat_id: ctx.chat.id,
                        message_id: Number(action),
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        }));
        return this.bot;
    }
}
exports.default = SlotStakeScene;
