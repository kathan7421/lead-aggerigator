import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { CompanyserviceService } from './companyservice.service';
import { Company } from './company.model';
import { AuthService } from 'src/app/auth-service.service';
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  companies: Company[] = []; 
  constructor(private router:Router,private route: ActivatedRoute, private company:CompanyserviceService,private authService:AuthService) { }
 
  ngOnInit(): void {
    this.loadCompany();
  }

  isChildRouterActive():boolean{
    return this.router.url.includes('/company/add');
  }
  loadCompany() : void {
    if(this.authService.isLoggedIn()) {
    this.company.getCompany().subscribe(
      (response: {companies: Company[]}) => {
         this.companies = response.companies;
         console.log('Companies feached Successfully:',this.companies);
      },
      (error) => {
        console.error('Error Feaching Companies',error);
      }
    );
  }else{
    console.error('User Not Logged In');
  }
  }
}
