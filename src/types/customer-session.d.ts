import "express-session";

declare module "express-session" {
  interface SessionData {
    customerId: number;
    transactionId: number;
  }
}
