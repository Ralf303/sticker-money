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
const redis_1 = require("redis");
const redis_class_1 = __importDefault(require("./redis.class"));
class RedisService extends redis_class_1.default {
    constructor() {
        super();
        const url = "redis://localhost:6379";
        this.client = (0, redis_1.createClient)({ url });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.disconnect();
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.set(key, value, {
                EX: 86400,
            });
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.client.get(key);
            return value;
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.client.del(key);
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.connect();
            console.log("Redis connected");
        });
    }
    checkAction(id, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const queryId = (_c = (_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.update) === null || _a === void 0 ? void 0 : _a.callback_query) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.message_id;
                const value = yield this.get(`action_${String(id)}`);
                if (value === String(queryId)) {
                    return;
                }
                else {
                    yield ctx.deleteMessage();
                    throw new Error("Остановка выполнения, action не актуален");
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const value = yield this.get(`action_${String(id)}`);
                return value;
            }
            catch (error) {
                throw error;
            }
        });
    }
    saveAction(id, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messageId = message === null || message === void 0 ? void 0 : message.message_id;
                yield this.set(`action_${String(id)}`, messageId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getStake(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.get(`stake_${String(id)}`);
            if (!value) {
                yield this.set(`stake_${String(id)}`, "50");
                return 50;
            }
            else {
                return Number(value);
            }
        });
    }
    setStake(id, stake) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.set(`stake_${String(id)}`, `${stake}`);
            return stake;
        });
    }
    setStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.set(`status_${String(id)}`, status);
        });
    }
    getStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.get(`status_${String(id)}`);
            return value || "";
        });
    }
}
exports.default = RedisService;
