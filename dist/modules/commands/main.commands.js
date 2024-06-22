"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = void 0;
const commands_class_1 = __importDefault(require("./commands.class"));
class Commands extends commands_class_1.default {
    constructor(bot, redis, db) {
        super(bot, redis, db);
    }
    //тут пока ниче нет, забей
    handler() {
        // this.bot.help(async (ctx) => {
        //   try {
        //     const { id, first_name, username } = ctx.from;
        //     const user = await this.db.getUser(String(id), username, first_name);
        //     ctx.scene.enter("slotStake");
        //   } catch (error) {
        //     console.log(error);
        //   }
        // });
    }
}
exports.Commands = Commands;
