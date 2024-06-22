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
exports.DatabaseService = void 0;
const client_1 = require("@prisma/client");
const db_class_1 = __importDefault(require("./db.class"));
class DatabaseService extends db_class_1.default {
    constructor() {
        super();
        this.prisma = new client_1.PrismaClient();
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prisma.$connect();
                console.log("Database connected");
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getUser(chatId, username, firstName
    //@ts-ignore
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.prisma.users.findFirst({
                    where: {
                        chatId: chatId,
                    },
                });
                if (!user) {
                    user = yield this.prisma.users.create({
                        data: {
                            chatId: chatId,
                            username: username,
                            firstName: firstName,
                        },
                    });
                }
                return user;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateUserBalance(id, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prisma.users.update({
                    where: {
                        id: id,
                    },
                    data: {
                        balance: value,
                    },
                });
                return;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.DatabaseService = DatabaseService;
