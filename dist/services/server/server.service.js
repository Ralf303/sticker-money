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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const server_class_1 = require("./server.class");
class ServerService extends server_class_1.Server {
    constructor(bot, configService) {
        this.bot = bot;
        this.configService = configService;
        this.port = parseInt(configService.get("PORT"), 10);
        this.sert = configService.get("CERT");
        this.key = configService.get("KEY");
        this.app = (0, express_1.default)();
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.webhookUrl = process.env.WEB_HOOK_URL || "";
        if (this.webhookUrl) {
            this.bot.telegram.setWebhook(`${this.webhookUrl}/bot${process.env.BOT_TOKEN}`);
            this.app.use(this.bot.webhookCallback(`/bot${process.env.BOT_TOKEN}`));
        }
        else {
            this.bot.launch({ dropPendingUpdates: true });
            console.log("Bot started without webhook");
        }
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.webhookUrl) {
                const httpsOptions = {
                    key: fs_1.default.readFileSync(this.key),
                    cert: fs_1.default.readFileSync(this.sert),
                };
                https_1.default.createServer(httpsOptions, this.app).listen(this.port, () => {
                    console.log(`HTTPS server started on port ${this.port}`);
                });
                console.log(`Bot started with webhook at ${this.webhookUrl}`);
            }
        });
    }
}
exports.default = ServerService;
