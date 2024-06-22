"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = void 0;
const commands_class_1 = __importDefault(require("./commands-class"));
class Commands extends commands_class_1.default {
  constructor(bot, redis, db) {
    super(bot, redis, db);
  }
  handler() {
    this.bot.help((ctx) =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          const { id, first_name, username } = ctx.from;
          const user = yield this.db.getUser(String(id), username, first_name);
          ctx.scene.enter("echo");
        } catch (error) {
          console.log(error);
        }
      })
    );
  }
}
exports.Commands = Commands;
