import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";

export interface IKeyboard {
  main(): InlineKeyboardMarkup;
  games(): InlineKeyboardMarkup;
  cube(stake: number, option: string): InlineKeyboardMarkup;
  slots(stake: number): InlineKeyboardMarkup;
  chooseSlot(): InlineKeyboardMarkup;
  chooseKube(): InlineKeyboardMarkup;
  balance(): InlineKeyboardMarkup;
}
