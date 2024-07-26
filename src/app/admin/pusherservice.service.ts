import { Injectable, NgZone } from '@angular/core';
import Pusher from 'pusher-js';
import { Subject, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class PusherserviceService {
  private pusherClient: Pusher;
  private inquirySubject: Subject<any> = new Subject<any>();

  constructor(private toastr: ToastrService, private ngZone: NgZone) {
    this.pusherClient = new Pusher('2adee300a1514e71b98f', {
      cluster: 'ap2',
    });

    const channel = this.pusherClient.subscribe('inquiries');
    channel.bind('inquiry.added', (data: any) => {
      console.log('Received notification data:', data); // Debugging line
      this.ngZone.run(() => {
        this.toastr.success('New inquiry added!', 'Notification');
        this.inquirySubject.next(data.inquiry);
      });
    });
  }

  getInquiryNotifications(): Observable<any> {
    return this.inquirySubject.asObservable();
  }
}
