export interface UserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface SubscriptionPayment {
  _id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  billingCycle: string;
  createdAt: string;
  updatedAt: string;
  userId: UserInfo;
}
