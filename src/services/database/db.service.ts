import { PrismaClient } from "@prisma/client";
import Database from "./db.class";
import { User } from "../../core/user";

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
    username: string | undefined,
    firstName: string | undefined
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
}
