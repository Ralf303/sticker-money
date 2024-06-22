"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const keyboard_service_1 = __importDefault(require("../../keyboards/keyboard.service"));
class Action {
    constructor(bot, redis, db) {
        this.bot = bot;
        this.redis = redis;
        this.db = db;
        this.keyboardService = new keyboard_service_1.default();
    }
}
exports.default = Action;
