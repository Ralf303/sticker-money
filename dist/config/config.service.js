"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
class ConfigService {
    constructor() {
        const { error, parsed } = (0, dotenv_1.config)();
        if (error) {
            throw new Error("Нет env файла");
        }
        if (!parsed) {
            throw new Error("Пустой env");
        }
        this.config = parsed;
    }
    get(key) {
        const res = this.config[key];
        if (!res) {
            return `No env for key ${key}`;
        }
        return res;
    }
}
exports.default = ConfigService;
