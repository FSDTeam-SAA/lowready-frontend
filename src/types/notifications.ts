
export interface INotification {
  _id: string;
  to: string;
  message: string;
  isViewed: boolean;
  type: string;
  id: string; // This seems to reference another entity
  createdAt: string;
  updatedAt: string;
}

// The response structure from your API
export interface NotificationsResponse {
  success: boolean;
  data: INotification[];
  message?: string;
}