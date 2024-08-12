import { Component, OnInit, ViewChild } from '@angular/core';
import { InquiryService } from './inquiry.service';
import { Inquiry } from './inquiry.model';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { DialogService } from 'primeng/dynamicdialog';
import { error } from 'jquery';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Company } from '../company/company.model';
import { CompanyserviceService } from '../company/companyservice.service';
import { Table } from 'primeng/table';



@Component({
  selector: 'app-inquiry',
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.css']
})
export class InquiryComponent implements OnInit {
  @ViewChild('dt2') dt2!: Table;
  inquiries: Inquiry[] = [];
  selectedInquiry: Inquiry[] = [];
  loading: boolean = true;
  visible: boolean = false;
  inquiry: Inquiry | null = null;
  inquiryForm!:FormGroup;
  disable: boolean = true; 
  selectedInquiryId: number | null = null;
  filteredInquiries: Inquiry[] = [];
  startDate!: Date;
  endDate!: Date;
  companies: Company[] = [];
  selectedCompanies: Company[] = [];
  
  constructor(private inquiryService: InquiryService, private toastr: ToastrService,private route: ActivatedRoute,public dialogService: DialogService, private fb: FormBuilder,private companyService:CompanyserviceService) {}

  ngOnInit(): void {
    this.loadCompanies();
    this.inquiryForm = this.fb.group({
      name: [{ value: 'N/A', disabled: true }],
      email: [{ value: 'N/A', disabled: true }],
      phone: [{value: 'N/A',disabled:true}],
      service_name: [{value: 'N/A',disabled:true}],
      company_name: [{value:'N/A',disabled:true}],
      message: [{ value: 'N/A', disabled: true }]
    });
    this.route.data.subscribe((response:any ) => {
      this.inquiries = response.data.data; // Extract the data array from the response
      this.filteredInquiries = response.data.data;
      console.log('Inquiries fetched successfully', this.inquiries);
      this.loading = false;
    },
    error => {
      console.error('Error fetching data', error);
    });
  }
  showDialog(inquiryId: number) {
    this.inquiryService.getById(inquiryId).subscribe(
      (response: { data: Inquiry }) => {
        this.inquiry = response.data;

        this.inquiryForm.patchValue({
          name: this.inquiry.name || 'N/A',
          email: this.inquiry.email || 'N/A',
          phone: this.inquiry.phone || 'N/A',
          service_name: this.inquiry.service_name || 'N/A',
          company_name: this.inquiry.company_name || 'N/A',
          message: this.inquiry.message || 'N/A'
          // Do not patch the image value here
        });
        this.visible = true; // Make sure to show the dialog
      },
      error => {
        console.error('Error fetching data', error);
      }
    );
  }
  loadCompanies() {
    this.companyService.getCompany().subscribe(
      (response: { data: Company[] }) => {
        this.companies = response.data;
      },
      error => {
        console.error('Error loading companies', error);
      }
    );
  }
  sendInquiries() {
    if (this.selectedCompanies.length > 0 && this.selectedInquiry.length > 0) {
      const companyIds = this.selectedCompanies.map(company => company.id);
  
      // Prepare payload to send multiple inquiries to selected companies
      const inquiryIds = this.selectedInquiry.map(inquiry => inquiry.id);
  
      // Send the request to the server with multiple inquiries
      this.inquiryService.sendInquiries(inquiryIds, companyIds).subscribe(
        response => {
          console.log('Inquiries sent successfully');
        },
        error => {
          console.error('Error sending inquiries', error);
        }
      );
  
      alert('Inquiries sent successfully.');
    } else {
      alert('Please select companies and inquiries.');
    }
  }
  deleteSelectedCompanies(): void {
    if (this.selectedInquiry.length === 0) {
      Swal.fire('No Selection', 'Please select at least one inquiry to delete.', 'info');
      return;
    }

    const inquiryIds = this.selectedInquiry.map(inquiry => inquiry.id);

    Swal.fire({
      title: 'Are You Sure?',
      text: 'You will not be able to recover these Inquiries!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete them!',
      cancelButtonText: 'No, keep them'
    }).then((result) => {
      if (result.isConfirmed) {
        this.inquiryService.bulkDelete(inquiryIds).subscribe(
          response => {
            this.inquiries = this.inquiries.filter(inquiry => !inquiryIds.includes(inquiry.id));
            this.selectedCompanies = [];
            Swal.fire('Deleted!', 'The selected inquiries have been deleted.', 'success');
            this.loadInquiries();
          },
          error => {
            console.error('Error deleting inquiries:', error);
            Swal.fire('Error!', 'Failed to delete the selected inquiries.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The selected inquiries are safe :)', 'info');
      }
    });
  }
  

  exportCsv() {
    if (this.selectedInquiry.length === 0) {
      console.error('No companies selected for export.');
      this.toastr.warning('Please Select atleast 1 Company');
      return;
    }
  
    const selectedCompaniesData = this.selectedInquiry.map(company => ({
      ID: company.id,
      Name: company.name,
      Email: company.email,
      Phone: company.phone,
      Service_Name: company.service_name,
      Company_Name: company.company_name,
      'Created At': company.created_at,
      // 'Updated At': company.updated_at,
      // Status: company.status === 1 ? 'Active' : 'Inactive',
      // Add more fields as needed
    }));
  
    const csvContent = this.convertToCSV(selectedCompaniesData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
  
    downloadLink.href = url;
    downloadLink.setAttribute('download', 'Inquiry.csv');
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    this.toastr.success('Inquiries exported successfully.');
    this.selectedInquiry = [];
  
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
  
  loadInquiries(): void {
    this.inquiryService.getInquiry().subscribe(
      (response: { data: Inquiry[] }) => {
        this.inquiries = response.data;
        this.filteredInquiries = response.data;
        this.loading = false;
      },
      error => {
        console.error('Error loading inquiries', error);
        this.loading = false;
      }
    );
  }

  changeStatus(inquiryId: number, checked: boolean): void {
    this.inquiryService.updateStatus(inquiryId, checked ? 1 : 0).subscribe(
     
      (response: Inquiry) => {
        // this.getall();
        const message = checked ? 'You have made the status Active' : 'You have made the status Inactive';
        this.toastr.success(message, 'Inquiry Status Updated Successfully');

        // Update the local company status to avoid blinking effect
        const inquiry = this.inquiries.find(c => c.id === inquiryId);
        if (inquiry) {
          inquiry.status = checked;
        }
      },
      error => {
        console.error('Error Changing status', error);
      }
    );
  }
  deletedInquiry(inquiryId:number): void {
    Swal.fire({
      title: 'Are You Sure?',
      text: 'You will not be able to recover this Inquiry! ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
       }).then((result) => {
         if (result.isConfirmed) {
           this.inquiryService.deleteInquiry(inquiryId).subscribe(
             response => {
               console.log('Inquiry deleted successfully:', response);
              
               Swal.fire('Deleted!', 'The Inquiry has been deleted.', 'success');
               this.loadInquiries();
             },
             error => {
               console.error('Error deleting Company:', error);
               // Handle error, such as displaying an error message
               Swal.fire('Error!', 'Failed to delete the Inquiry.', 'error');
             }
           );
         } else if (result.dismiss === Swal.DismissReason.cancel) {
           Swal.fire('Cancelled', 'The Inquiry is safe :)', 'info');
         }
       });
  }
  filterInquiries() {
    this.loading = true;
    const startDate = this.startDate ? this.formatDate(this.startDate) : undefined;
    const endDate = this.endDate ? this.formatDate(this.endDate) : undefined;
  
    this.inquiryService.getInquiry(startDate, endDate).subscribe(
      (response: { data: Inquiry[] }) => {
        this.inquiries = response.data;
        this.filteredInquiries = [...this.inquiries];
        this.loading = false;

      },
      error => {
        console.error('Error filtering inquiries', error);
        this.loading = false;
      }
    );
  }
  
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  
  canRestore(id: number): boolean {
    // Determine if the inquiry can be restored
    return this.inquiries.some(i => i.id === id && i.status === true);
  }
  filterGlobal(event: Event): void {
    // Ensure `event.target` is an HTMLInputElement
    const input = event.target as HTMLInputElement;
    this.dt2.filterGlobal(input.value, 'contains');
  }
  restoreAll(): void {
    const inquiryIds = this.inquiries.filter(i => i.status === true).map(i => i.id);
    this.inquiryService.restoreAll(inquiryIds.length > 0 ? inquiryIds : undefined).subscribe(
        () => {
            this.loadInquiries();
            this.selectedInquiry = [];
        },
        error => console.error(error)
    );
}


  
  

  
}
