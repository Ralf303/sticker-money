import { Stakes } from "../../core/stakes";
import { User } from "../../core/user";

export default abstract class Database {
  constructor() {}

  abstract connect(): Promise<void>;

  abstract getUser(
    chatId: string,
    username?: string | undefined,
    firstName?: string | undefined
  ): Promise<User>;

  abstract updateUserBalance(
    id: number,
    value: string | boolean | number
  ): Promise<void>;

  abstract updateUserDemo(
    id: number,
    value: string | boolean | number
  ): Promise<void>;

  abstract getStakes(): Promise<Stakes>;
}
