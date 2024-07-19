import { Component, OnDestroy, OnInit } from '@angular/core';

import { ActivatedRoute,NavigationEnd,Router } from '@angular/router';
import { CompanyserviceService } from './companyservice.service';
import { ToastrService } from 'ngx-toastr';
import {ChangeStatusResponse, Company } from './company.model';
import { AuthService } from 'src/app/auth-service.service';
import Swal from 'sweetalert2';
import { ConfirmationService } from 'primeng/api';
import { Subscription, filter } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyUploadService } from './company-upload.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
  
})
export class CompanyComponent implements OnInit{


  constructor( private fb: FormBuilder, private uploadService: CompanyUploadService,private router:Router,private route: ActivatedRoute, private confirmationService: ConfirmationService,private company:CompanyserviceService,private authService:AuthService,public toastr: ToastrService,) {
  }
  companies: Company[] = []; 
  selectedCompanies: any[] = [];
  companyCount: number = 0;
  isLoading: boolean = false;
  disableStates: { [key: number]: boolean } = {};
  routerSubscription: Subscription | null = null;
  uploadForm!: FormGroup;
  file: File | null = null;
  displayUploadDialog: boolean = false;
  
  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      file: [null, Validators.required]
    });
    this.getall();
    // this.loadCompany();

    // this.companies = this.route.snapshot.data['data'].data;
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
  showUploadDialog() {
    this.displayUploadDialog = true;
  }

  onFileChange(event: any) {
    const file = event.files[0]; // PrimeNG FileUpload event
    if (file && (file.type === 'application/vnd.ms-excel' || file.type === 'text/csv')) {
      this.file = file;
      this.uploadForm.patchValue({ file: this.file });
      this.uploadForm.get('file')?.markAsTouched();
      this.uploadForm.get('file')?.markAsDirty();
    } else {
      this.toastr.error('Invalid file format. Please upload a CSV file.');
      this.uploadForm.reset();
    }
  }

  onSubmit() {
    if (this.uploadForm.invalid || !this.file) {
      this.toastr.error('Form is invalid. Please upload a valid CSV file.');
      return;
    }

    this.uploadService.uploadFile(this.file).subscribe(
      (response) => {
        this.toastr.success('File uploaded successfully');
        // this.getall();
        this.loadCompany();
      },
      (error) => {
        this.toastr.error('File upload failed');
      }
    );
  }
  refresh(){
    this.getall();
  }
 
  isChildRouterActive():boolean{
    return this.router.url.includes('/company/add') || this.router.url.includes('/company/edit') || this.router.url.includes('/company/view');
   }
   getall():void {
   this.route.data.subscribe((response: any) => {
    this.isLoading = true;

    if (response && response.data ) {
      const companies = response.data.data; // Access companies array
    
      this.companies =companies;
      this.companies = companies.map((company: any) => {
        if (!company.description) {
          company.description = '-';
        }
        return company;
      });
      if (companies.length > 0) {
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
exportCsv() {
  if (this.selectedCompanies.length === 0) {
    console.error('No companies selected for export.');
    this.toastr.warning('Please Select atleast 1 Company');
    return;
  }

  const selectedCompaniesData = this.selectedCompanies.map(company => ({
    ID: company.id,
    Name: company.name,
    Description: company.description,
    Email: company.email,
    'Created At': company.created_at,
    'Updated At': company.updated_at,
    // Status: company.status === 1 ? 'Active' : 'Inactive',
    'phone':company.phone,
    'tag_line':company.tag_line,
    Logo: company.logo // Adjust as per your actual data structure
    // Add more fields as needed
  }));

  const csvContent = this.convertToCSV(selectedCompaniesData);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const downloadLink = document.createElement('a');
  const url = URL.createObjectURL(blob);

  downloadLink.href = url;
  downloadLink.setAttribute('download', 'companies.csv');
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

private convertToCSV(data: any[]) {
  if (!data || data.length === 0) {
    console.error('No data to convert to CSV.');
    return '';
  }

  const header = Object.keys(data[0]).join(',');
  const rows = data.map(obj => Object.values(obj).join(','));
  return `${header}\n${rows.join('\n')}`;
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
            return company;
          });
  
          console.log('Companies fetched successfully:', this.companies);
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
    this.company.updateCompanyStatus(companyId, checked ? 1 : 0).subscribe(
     
      (response: Company) => {
        // this.getall();
        const message = checked ? 'You have made the status Active' : 'You have made the status Inactive';
        this.toastr.success(message, 'Company Status Updated Successfully');

        // Update the local company status to avoid blinking effect
        const company = this.companies.find(c => c.user_id === companyId);
        if (company) {
          company.status = checked;
        }
      },
      error => {
        console.error('Error Changing status', error);
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
              
               Swal.fire('Deleted!', 'The Country has been deleted.', 'success');
               this.loadCompany();
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
            this.getall();
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
