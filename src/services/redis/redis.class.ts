export default abstract class Redis {
  constructor() {}

  abstract connect(): Promise<void>;

  abstract checkAction(id: number, ctx: any): Promise<void>;

  abstract saveAction(id: number, message: any): Promise<void>;

  abstract getAction(id: number): Promise<string | null>;

  abstract getStake(id: number): Promise<number>;

  abstract setStake(id: number, stake: number): Promise<number>;

  abstract setStatus(id: number, status: string): Promise<void>;

  abstract getStatus(id: number): Promise<string>;

  abstract setOption(id: number, option: string): Promise<void>;

  abstract getOption(id: number): Promise<string>;

  abstract setDemo(id: number): Promise<void>;

  abstract getDemo(id: number): Promise<boolean>;

  abstract setOrder(id: number, link: string): Promise<void>;

  abstract getOrder(id: number): Promise<string>;

  abstract deleteOrder(id: number): Promise<void>;
}
