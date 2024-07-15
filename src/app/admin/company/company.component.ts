import { Component, OnDestroy, OnInit } from '@angular/core';

import { ActivatedRoute,NavigationEnd,Router } from '@angular/router';
import { CompanyserviceService } from './companyservice.service';
import { ToastrService } from 'ngx-toastr';
import {ChangeStatusResponse, Company } from './company.model';
import { AuthService } from 'src/app/auth-service.service';
import Swal from 'sweetalert2';
import { ConfirmationService } from 'primeng/api';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit, OnDestroy{


  constructor(private router:Router,private route: ActivatedRoute, private confirmationService: ConfirmationService,private company:CompanyserviceService,private authService:AuthService,public toastr: ToastrService,) {
  }
  companies: Company[] = []; 
  selectedCompanies: any[] = [];
  companyCount: number = 0;
  isLoading: boolean = false;
  disableStates: { [key: number]: boolean } = {};
  routerSubscription: Subscription | null = null;
  
  ngOnInit(): void {
    // this.getall();
    // this.loadCompany();

    this.companies = this.route.snapshot.data['data'].data;
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     this.loadCompany(); // Load data on every navigation end
    //   }
    // });
    

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (!this.isChildRouterActive()) {
          this.loadCompany();
        }
      });
    const disableState = localStorage.getItem('disableState');
    if (disableState) {
        try {
            const parsedState = JSON.parse(disableState);
            if (typeof parsedState === 'object' && parsedState !== null) {
                this.disableStates = parsedState;
            } else {
                this.disableStates = {};
            }
        } catch (e) {
            this.disableStates = {};
        }
    } else {
        this.disableStates = {};
    }
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  
  refresh(){
    this.loadCompany();
  }
 
  isChildRouterActive():boolean{
    return this.router.url.includes('/company/add') || this.router.url.includes('/company/edit') || this.router.url.includes('/company/view');
   }
   getall():void {
   this.route.data.subscribe((response: any) => {
    console.log('Raw data from resolver:', response); // Log raw data

    if (response && response.data ) {
      const companies = response.data.data; // Access companies array

      if (companies.length > 0) {
        this.companies = companies.map((company: any) => {
          if (!company.description) {
            company.description = '-';
          }
          return company;
        });

        console.log('Companies fetched successfully:', this.companies);
      } else {
        console.error('No company data found.');
      }
    } else {
      console.error('Invalid data structure received:', response);
    }
  }, err => {
    console.error('Error fetching company data:', err);
  });
}

   loadCompany(): void {
    if (this.authService.isLoggedIn()) {
      this.isLoading = true;
      this.company.getCompany().subscribe(
        (response: { data: Company[] }) => { // Adjusted type to match your API response structure
          this.companies = response.data.map(item => {
            let company = item;
  
            // Check if the description is null or empty and set it to '-'
            if (!company.description) {
              company.description = '-';
            }
  
            // Return the modified company object
            return company;
          });
  
          console.log('Companies fetched successfully:', this.companies);
  
          // Initialize disableStates if not already initialized
          this.companies.forEach(company => {
            if (!(company.user_id in this.disableStates)) {
              this.disableStates[company.user_id] = false;
            }
          });
  
          // Save disableStates to localStorage
          localStorage.setItem('disableState', JSON.stringify(this.disableStates));
  
          this.isLoading = false;
        },
        error => {
          console.error('Error fetching companies', error);
          this.isLoading = false;
        }
      );
    } else {
      console.error('User not logged in');
    }
  }

  changeCountryStatus(companyId: number, checked: boolean): void {
    const newStatus = checked ? 1 : 0; // Convert boolean checked value to 1 or 0
    this.company.updateCompanyStatus(companyId, newStatus).subscribe(
      (response: Company) => {
        // Determine the success message based on the newStatus
        const message = newStatus === 1 ? 'You have made the status Active' : 'You have made the status Inactive';
        this.toastr.success(message, 'Company Status Updated Successfully'); // Show success message using Toastr
      },
      error => {
        console.error('Error Changing status', error); // Log error to console if update fails
        // Handle error state if needed
      }
    );
  }
  
  activeCompany(user_id: number): void {
    this.disableStates[user_id] = true; // Disable button immediately
    localStorage.setItem('disableState', JSON.stringify(this.disableStates)); // Save to localStorage
  
    // Call API to activate company
    this.company.activeCompany(user_id).subscribe(
      (response: Company) => {
        this.toastr.success('Company Activated Successfully', 'Company Status Updated Successfully');
      },
      error => {
        console.error('Error activating company', error);
        // Re-enable button if there's an error
        this.disableStates[user_id] = false;
        localStorage.setItem('disableState', JSON.stringify(this.disableStates)); // Update localStorage
      }
    );
  }
  deleteCompany(companyId:number): void{
    Swal.fire({
      title: 'Are You Sure?',
      text: 'You will not be able to recover this Company! ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
       }).then((result) => {
         if (result.isConfirmed) {
           this.company.deleteCompany(companyId).subscribe(
             response => {
               console.log('Company deleted successfully:', response);
               this.getall();
               Swal.fire('Deleted!', 'The Country has been deleted.', 'success');
             },
             error => {
               console.error('Error deleting Company:', error);
               // Handle error, such as displaying an error message
               Swal.fire('Error!', 'Failed to delete the Company.', 'error');
             }
           );
         } else if (result.dismiss === Swal.DismissReason.cancel) {
           Swal.fire('Cancelled', 'The Company is safe :)', 'info');
         }
       });
  }
  deleteSelectedCompanies(): void {
    if (this.selectedCompanies.length === 0) {
      Swal.fire('No Selection', 'Please select at least one company to delete.', 'info');
      return;
    }

    const companyIds = this.selectedCompanies.map(company => company.user_id);

    Swal.fire({
      title: 'Are You Sure?',
      text: 'You will not be able to recover these Companies!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete them!',
      cancelButtonText: 'No, keep them'
    }).then((result) => {
      if (result.isConfirmed) {
        this.company.deleteCompanies(companyIds).subscribe(
          response => {
            this.companies = this.companies.filter(company => !companyIds.includes(company.id));
            this.selectedCompanies = [];
            Swal.fire('Deleted!', 'The selected companies have been deleted.', 'success');
          },
          error => {
            console.error('Error deleting companies:', error);
            Swal.fire('Error!', 'Failed to delete the selected companies.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The selected companies are safe :)', 'info');
      }
    });
  }
 
}
