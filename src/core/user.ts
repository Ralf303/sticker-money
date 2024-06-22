export interface User {
  id: number;
  chatId: string;
  username: string | null;
  firstName: string | null;
  balance: number;
  demo: number;
  isBan: boolean;
}
