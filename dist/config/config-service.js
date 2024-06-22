"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
class default_1 {
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
            throw new Error("Пустой env");
        }
        return res;
    }
}
exports.default = default_1;
