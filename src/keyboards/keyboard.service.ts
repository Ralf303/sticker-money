import { Key, Keyboard } from "telegram-keyboard";
import { IKeyboard } from "./keyboard.interface";
import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";
import ru from "../localization/ru.json";

export default class KeyboardService implements IKeyboard {
  main(): InlineKeyboardMarkup {
    const keyboard = Keyboard.inline([
      [ru.buttons.start],
      [ru.buttons.wallet],
      [Key.url(ru.buttons.support.text, ru.buttons.support.url)],
    ]);

    return keyboard.reply_markup;
  }

  games(): InlineKeyboardMarkup {
    const keyboard = Keyboard.inline([
      [ru.buttons.games.slots],
      [ru.buttons.games.cube],
      [ru.buttons.back],
    ]);

    return keyboard.reply_markup;
  }

  slots(stake: number): InlineKeyboardMarkup {
    const keyboard = Keyboard.inline([
      [Key.callback("-", `-slot`), stake, Key.callback("+", `+slot`)],
      [
        Key.callback(ru.buttons.stake.min, `${ru.buttons.stake.min}slot`),
        Key.callback(ru.buttons.stake.double, `${ru.buttons.stake.double}slot`),
        Key.callback(ru.buttons.stake.max, `${ru.buttons.stake.max}slot`),
      ],
      [Key.callback(ru.buttons.back, ru.buttons.start), ru.main.slots.spin],
    ]);

    return keyboard.reply_markup;
  }

  cube(stake: number, option: string): InlineKeyboardMarkup {
    const options = ["1", "2", "3", "4", "5", "6"];
    const keyboard = Keyboard.inline([
      [Key.callback("-", `-cube`), stake, Key.callback("+", `+cube`)],
      [
        Key.callback(ru.buttons.stake.min, `${ru.buttons.stake.min}cube`),
        Key.callback(ru.buttons.stake.double, `${ru.buttons.stake.double}cube`),
        Key.callback(ru.buttons.stake.max, `${ru.buttons.stake.max}cube`),
      ],
      ["Выбери исход:"],
      options.map((opt, index) =>
        index + 1 === Number(option) ? `•${opt}•` : opt
      ),
      [
        option === "Четный" ? "•Четный•" : "Четный",
        option === "Нечетный" ? "•Нечетный•" : "Нечетный",
      ],
      [Key.callback(ru.buttons.back, ru.buttons.start), ru.main.сube.spin],
    ]);

    return keyboard.reply_markup;
  }

  chooseSlot(): InlineKeyboardMarkup {
    const keyboard = Keyboard.inline([
      [Key.callback(ru.buttons.real, "real slot")],
      [Key.callback(ru.buttons.demo, "demo slot")],
      [Key.callback(ru.buttons.back, ru.buttons.start)],
    ]);

    return keyboard.reply_markup;
  }

  chooseKube(): InlineKeyboardMarkup {
    const keyboard = Keyboard.inline([
      [Key.callback(ru.buttons.real, "real cube")],
      [Key.callback(ru.buttons.demo, "demo cube")],
      [Key.callback(ru.buttons.back, ru.buttons.start)],
    ]);

    return keyboard.reply_markup;
  }

  balance(): InlineKeyboardMarkup {
    const keyboard = Keyboard.inline([
      [ru.buttons.balance.down, ru.buttons.balance.up],
      [ru.buttons.balance.demo],
      [ru.buttons.back],
    ]);

    return keyboard.reply_markup;
  }

  down(card: string, amount: number): InlineKeyboardMarkup {
    const keyboard = Keyboard.inline([
      [
        Key.callback(
          ru.buttons.balance.check.approve,
          `down_${card}_${amount}`
        ),
      ],
      [ru.buttons.balance.check.retry],
    ]);

    return keyboard.reply_markup;
  }

  back(): InlineKeyboardMarkup {
    const keyboard = Keyboard.inline([[ru.buttons.back]]);

    return keyboard.reply_markup;
  }

  channel(id: string, amount: string): InlineKeyboardMarkup {
    const keyboard = Keyboard.inline([
      [Key.callback(ru.buttons.channel.succsess, `done_${id}_${amount}`)],
      [Key.callback(ru.buttons.channel.wrong, `wrong_${id}_${amount}`)],
    ]);

    return keyboard.reply_markup;
  }

  cancel(): InlineKeyboardMarkup {
    const keyboard = Keyboard.inline([[ru.buttons.cancel]]);

    return keyboard.reply_markup;
  }

  getUrl(link: string): InlineKeyboardMarkup {
    const keyboard = Keyboard.inline([[Key.url(ru.buttons.getUrl, link)]]);

    return keyboard.reply_markup;
  }
}
