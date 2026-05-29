import { inject, Injectable, signal } from "@angular/core";
import { AuthenticationService } from "./authentication-service";
import { AppNotification } from "../interfaces/notification";

@Injectable({
    providedIn: "root"
})
export class NotificationService {
    private url = 'http://localhost:4001/notifications';
    authenticationService = inject(AuthenticationService);
    
    notifications = signal<AppNotification[]>([]);
    unreadCount = signal<number>(0);
    
    private intervalId: any;

    constructor() {
        this.startPolling();
    }

    startPolling() {
        if (this.intervalId) return; 
        this.getNotifications(); 
        
        this.intervalId = setInterval(() => {
            this.getNotifications();
        }, 15000);
    }

    stopPolling() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }


    async getNotifications() {
        try {
            const authToken = this.authenticationService.token;
            if (authToken) {
                const response = await fetch(`${this.url}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authToken
                    }
                });
                const data: AppNotification[] = await response.json();
                
                if(!data.hasOwnProperty('error')) {
                    this.notifications.set(data);
                    this.unreadCount.set(data.filter(n => !n.isRead).length);
                }
                return data;
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
            return [];
        }
        return [];
    }

    async markAsRead(notificationId: number) {
        try {
            const authToken = this.authenticationService.token;
            if (authToken) {
                this.notifications.update(nots => 
                    nots.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
                );
                this.unreadCount.update(c => Math.max(0, c - 1));

                const response = await fetch(`${this.url}/${notificationId}/read`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authToken
                    }
                });
                return await response.json();
            }
            return null;
        } catch (err) {
            console.error('Error marking as read:', err);
            this.getNotifications();
            return null;
        }
    }

    async markAllAsRead() {
        try {
            const authToken = this.authenticationService.token;
            if (authToken) {
                this.notifications.update(nots => 
                    nots.map(n => ({ ...n, isRead: true }))
                );
                this.unreadCount.set(0);

                const response = await fetch(`${this.url}/read-all`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authToken
                    }
                });
                return await response.json();
            }
        } catch (err) {
            console.error('Error marking all as read:', err);
            this.getNotifications();
        }
    }
}