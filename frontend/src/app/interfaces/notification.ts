export interface AppNotification {
    id: number;
    title: string;
    message: string; 
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    createdAt: Date;
}