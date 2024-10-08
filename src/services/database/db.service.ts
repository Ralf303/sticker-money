import { PrismaClient } from "@prisma/client";
import Database from "./db.class";
import { User } from "../../core/user";
import { Stakes, StakeType } from "../../core/stakes";

export class DatabaseService extends Database {
  private prisma: PrismaClient;

  constructor() {
    super();
    this.prisma = new PrismaClient();
  }

  async connect() {
    try {
      await this.prisma.$connect();
      console.log("Database connected");
    } catch (error) {
      console.log(error);
    }
  }

  async getUser(
    chatId: string,
    username?: string | undefined,
    firstName?: string | undefined
    //@ts-ignore
  ): Promise<User> {
    try {
      let user: User | null = await this.prisma.users.findFirst({
        where: {
          chatId: chatId,
        },
      });

      if (!user) {
        user = await this.prisma.users.create({
          data: {
            chatId: chatId,
            username: username,
            firstName: firstName,
          },
        });
      }

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const users: User[] = await this.prisma.users.findMany();
      return users;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to retrieve users.");
    }
  }

  async updateUserBalance(id: number, value: number): Promise<void> {
    try {
      await this.prisma.users.update({
        where: {
          id: id,
        },
        data: {
          balance: value,
        },
      });

      return;
    } catch (error) {
      console.log(error);
    }
  }

  async updateUserDemo(id: number, value: number): Promise<void> {
    try {
      await this.prisma.users.update({
        where: {
          id: id,
        },
        data: {
          demo: value,
        },
      });

      return;
    } catch (error) {
      console.log(error);
    }
  }

  //@ts-ignore
  async getStakes(): Promise<Stakes> {
    try {
      const stakes: Stakes | null = await this.prisma.stakes.findFirst({
        where: {
          id: 1,
        },
      });

      //@ts-ignore
      return stakes;
    } catch (error) {
      console.log(error);
    }
  }

  async setLogs(
    type: string,
    userId: string,
    description: string
  ): Promise<void> {
    try {
      await this.prisma.logs.create({
        data: {
          type: type,
          userId: userId,
          description: description,
        },
      });

      return;
    } catch (error) {
      console.log(error);
    }
  }

  async updateStake(type: StakeType, value: number): Promise<boolean> {
    try {
      switch (type) {
        case "jackpot":
          await this.prisma.stakes.update({
            where: {
              id: 1,
            },
            data: {
              jackpot: value,
            },
          });
          break;

        case "bar":
          await this.prisma.stakes.update({
            where: {
              id: 1,
            },
            data: {
              bar: value,
            },
          });
          break;

        case "berries":
          await this.prisma.stakes.update({
            where: {
              id: 1,
            },
            data: {
              berries: value,
            },
          });
          break;

        case "lemons":
          await this.prisma.stakes.update({
            where: {
              id: 1,
            },
            data: {
              lemons: value,
            },
          });
          break;

        case "odd":
          await this.prisma.stakes.update({
            where: {
              id: 1,
            },
            data: {
              odd: value,
            },
          });
          break;

        case "correct":
          await this.prisma.stakes.update({
            where: {
              id: 1,
            },
            data: {
              correct: value,
            },
          });
          break;

        default:
          return false;
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
