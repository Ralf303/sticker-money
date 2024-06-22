"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegram_keyboard_1 = require("telegram-keyboard");
const ru_json_1 = __importDefault(require("../localization/ru.json"));
class KeyboardService {
    main() {
        const keyboard = telegram_keyboard_1.Keyboard.inline([
            [ru_json_1.default.buttons.start],
            [ru_json_1.default.buttons.wallet],
            [telegram_keyboard_1.Key.url(ru_json_1.default.buttons.support.text, ru_json_1.default.buttons.support.url)],
        ]);
        return keyboard.reply_markup;
    }
    games() {
        const keyboard = telegram_keyboard_1.Keyboard.inline([
            [ru_json_1.default.buttons.games.slots],
            [ru_json_1.default.buttons.games.cube],
            [ru_json_1.default.buttons.back],
        ]);
        return keyboard.reply_markup;
    }
    slots(stake) {
        const keyboard = telegram_keyboard_1.Keyboard.inline([
            [telegram_keyboard_1.Key.callback("-", `-slot`), stake, telegram_keyboard_1.Key.callback("+", `+slot`)],
            [
                telegram_keyboard_1.Key.callback(ru_json_1.default.buttons.stake.min, `${ru_json_1.default.buttons.stake.min}slot`),
                telegram_keyboard_1.Key.callback(ru_json_1.default.buttons.stake.double, `${ru_json_1.default.buttons.stake.double}slot`),
                telegram_keyboard_1.Key.callback(ru_json_1.default.buttons.stake.max, `${ru_json_1.default.buttons.stake.max}slot`),
            ],
            [telegram_keyboard_1.Key.callback(ru_json_1.default.buttons.back, ru_json_1.default.buttons.start), ru_json_1.default.main.slots.spin],
        ]);
        return keyboard.reply_markup;
    }
    cube(stake) {
        const keyboard = telegram_keyboard_1.Keyboard.inline([
            [telegram_keyboard_1.Key.callback("-", `-cube`), stake, telegram_keyboard_1.Key.callback("+", `+cube`)],
            [
                telegram_keyboard_1.Key.callback(ru_json_1.default.buttons.stake.min, `${ru_json_1.default.buttons.stake.min}cube`),
                telegram_keyboard_1.Key.callback(ru_json_1.default.buttons.stake.double, `${ru_json_1.default.buttons.stake.double}cube`),
                telegram_keyboard_1.Key.callback(ru_json_1.default.buttons.stake.max, `${ru_json_1.default.buttons.stake.max}cube`),
            ],
            ["1", "2", "3", "4", "5", "6"],
            ["Четный", "Нечетный"],
            [telegram_keyboard_1.Key.callback(ru_json_1.default.buttons.back, ru_json_1.default.buttons.start), ru_json_1.default.main.сube.spin],
        ]);
        return keyboard.reply_markup;
    }
    chooseSlot() {
        const keyboard = telegram_keyboard_1.Keyboard.inline([
            [telegram_keyboard_1.Key.callback(ru_json_1.default.buttons.real, "real slot")],
            [telegram_keyboard_1.Key.callback(ru_json_1.default.buttons.demo, "demo slot")],
            [telegram_keyboard_1.Key.callback(ru_json_1.default.buttons.back, ru_json_1.default.buttons.start)],
        ]);
        return keyboard.reply_markup;
    }
    chooseKube() {
        const keyboard = telegram_keyboard_1.Keyboard.inline([
            [telegram_keyboard_1.Key.callback(ru_json_1.default.buttons.real, "real cube")],
            [telegram_keyboard_1.Key.callback(ru_json_1.default.buttons.demo, "demo cube")],
            [telegram_keyboard_1.Key.callback(ru_json_1.default.buttons.back, ru_json_1.default.buttons.start)],
        ]);
        return keyboard.reply_markup;
    }
    balance() {
        const keyboard = telegram_keyboard_1.Keyboard.inline([
            [ru_json_1.default.buttons.balance.down, ru_json_1.default.buttons.balance.up],
            [ru_json_1.default.buttons.balance.demo],
            [ru_json_1.default.buttons.back],
        ]);
        return keyboard.reply_markup;
    }
}
exports.default = KeyboardService;
