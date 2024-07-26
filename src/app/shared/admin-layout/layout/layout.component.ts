import { Component, OnInit } from '@angular/core';
import { PusherserviceService } from 'src/app/admin/pusherservice.service'; // Adjust the path as necessary

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  notifications: any[] = [];
  notificationCount: number = 0;

  constructor(private pusherService: PusherserviceService) { }

  ngOnInit(): void {
    this.pusherService.getInquiryNotifications().subscribe(
      (notification: any) => {
        console.log('Notification received in Angular:', notification); // Debugging line

        const newNotification = { 
          name: notification.name || 'Unknown Inquiry',
          time: new Date().toLocaleTimeString() // Format as needed
        };
        this.notifications.push(newNotification);
        this.notificationCount = this.notifications.length;
      },
      error => {
        console.error('Error receiving notifications:', error);
      }
    );
  }
}
