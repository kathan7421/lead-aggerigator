import { Component, OnInit} from '@angular/core';
import { CompanyserviceService } from 'src/app/admin/company/companyservice.service';
import { AuthService } from 'src/app/auth-service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  currentUser: any;
  count: number = 0;

  constructor(private authService: AuthService ,private company:CompanyserviceService) { 

    
  }
  
  ngOnInit(): void {
    this.loadCompanyCount();
    let obj: any = localStorage.getItem('currentUser');
    let temp = JSON.parse(obj);
    this.currentUser = temp.name;
    console.log(this.currentUser);
  }
  // this.currentUser = this.authService.currentUserValue;
  loadCompanyCount() {
    this.company.getCount().subscribe(
      (response) => {
        this.count = response.count;
        console.log(this.count); // Log to verify the count value
    
      },
      (error) => {
        console.error('Error fetching company count', error);
      }
    );
  }
  logout() {
    this.authService.logout();
  }
  

}
