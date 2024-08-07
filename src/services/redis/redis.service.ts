import { RedisClientType, createClient } from "redis";
import Redis from "./redis.class";

class RedisService extends Redis {
  private client: RedisClientType;

  constructor() {
    super();
    const url: string = "redis://localhost:6379";
    this.client = createClient({ url });
  }

  private async disconnect() {
    await this.client.disconnect();
  }

  private async set(key: string, value: string) {
    await this.client.set(key, value);
  }

  private async get(key: string) {
    const value = await this.client.get(key);
    return value;
  }

  private async delete(key: string) {
    this.client.del(key);
  }

  async connect() {
    await this.client.connect();
    console.log("Redis connected");
  }
  async checkAction(id: number, ctx: any): Promise<void> {
    try {
      const queryId: string | undefined =
        ctx?.update?.callback_query?.message?.message_id;
      const value: string | null = await this.get(`action_${String(id)}`);

      if (value === String(queryId)) {
        return;
      } else {
        await ctx.deleteMessage();
        throw new Error("Остановка выполнения, action не актуален");
      }
    } catch (error) {
      throw error;
    }
  }

  async getAction(id: number): Promise<string | null> {
    try {
      const value: string | null = await this.get(`action_${String(id)}`);

      return value;
    } catch (error) {
      throw error;
    }
  }

  async saveAction(id: number, message: any): Promise<void> {
    try {
      const messageId: string = message?.message_id;
      await this.set(`action_${String(id)}`, messageId);
    } catch (error) {
      throw error;
    }
  }

  async getStake(id: number): Promise<number> {
    const value = await this.get(`stake_${String(id)}`);
    if (!value) {
      await this.set(`stake_${String(id)}`, "50");
      return 50;
    } else {
      return Number(value);
    }
  }

  async setStake(id: number, stake: number): Promise<number> {
    await this.set(`stake_${String(id)}`, `${stake}`);
    return stake;
  }

  async setStatus(id: number, status: string): Promise<void> {
    await this.set(`status_${String(id)}`, status);
  }

  async getStatus(id: number): Promise<string> {
    const value = await this.get(`status_${String(id)}`);
    return value || "";
  }

  async setOption(id: number, status: string): Promise<void> {
    await this.set(`option_${String(id)}`, status);
  }

  async getOption(id: number): Promise<string> {
    const value = await this.get(`option_${String(id)}`);

    if (!value) {
      await this.set(`option_${String(id)}`, "Нечетный");
      return "Нечетный";
    }

    return value || "Нечетный";
  }

  async setDemo(id: number): Promise<void> {
    await this.client.set(`demo_${String(id)}`, "true", { EX: 86400 });
  }

  async getDemo(id: number): Promise<boolean> {
    const value = await this.client.get(`demo_${String(id)}`);
    return value === "true";
  }

  async setOrder(id: number, link: string): Promise<void> {
    await this.client.set(`order_${String(id)}`, link, { EX: 600 });
  }

  async getOrder(id: number): Promise<string> {
    const value = (await this.client.get(`order_${String(id)}`)) || "";
    if (value) {
      return value;
    } else {
      return value;
    }
  }

  async deleteOrder(id: number): Promise<void> {
    await this.delete(`order_${String(id)}`);
  }
}

export default RedisService;
