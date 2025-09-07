
// Notification type
export interface INotification {
  _id: string;
  to: string;
  message: string;
  isViewed: boolean;
  type: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}

// API response type
export interface NotificationsResponse {
  success: boolean;
  data: INotification[];
  message?: string;
}
