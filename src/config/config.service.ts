import { config, DotenvParseOutput } from "dotenv";
import { IConfigService } from "./config.interface";

export default class ConfigService implements IConfigService {
  private config: DotenvParseOutput;

  constructor() {
    const { error, parsed } = config();

    if (error) {
      throw new Error("Нет env файла");
    }

    if (!parsed) {
      throw new Error("Пустой env");
    }

    this.config = parsed;
  }

  get(key: string): string {
    const res = this.config[key];

    if (!res) {
      return ``;
    }

    return res;
  }
}
