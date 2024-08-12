import { Component, OnInit, ViewChild } from '@angular/core';
import { ReviewsService } from './reviews.service';
import { AddReview, ChangeStatusResponse, Review } from './reviews.model';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { CompanyserviceService } from '../company/companyservice.service';
import { Company } from '../company/company.model';
import { SelectItem } from 'primeng/api';


@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  @ViewChild('dt2') dt2!: Table;
  reviewForm!: FormGroup;
  isEditMode: boolean = false;
  displayDialog: boolean = false;
  selectedReviews: Review[] = [];
  temp: any;
  review!: SelectItem[];
  reviews: Review[] = [];
  allReviews: Review[] = [];
  companies: { label: string, value: number }[] = [];
  loading: boolean = true;
  statusOptions = [
    { label: 'Pending', value: '1', class: 'pending' },
    { label: 'Approved', value: '2', class: 'approved' },
    { label: 'Rejected', value: '3', class: 'rejected' }
  ];
  
  selectedStatus: string | null = null;

  constructor(private reviewService: ReviewsService, private route: ActivatedRoute,private toastr: ToastrService,private compnanyservice:CompanyserviceService,private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadCompany();
    this.reviewForm = this.fb.group({
      company_id:['',Validators.required],
      rating:['',Validators.required],
      comment:['']
    });
    this.route.data.subscribe(
      (response: any) => {
        this.reviews = response.data.data;
        this.allReviews = response.data.data;
        console.log('Reviews fetched successfully', this.reviews);
        this.loading = false;
      },
      error => {
        console.error('Error fetching data', error);
      }
    );
  }
  filterGlobal(event: Event): void {
    // Ensure `event.target` is an HTMLInputElement
    const input = event.target as HTMLInputElement;
    this.dt2.filterGlobal(input.value, 'contains');
  }
  loadCompany(): void {
    this.compnanyservice.getCompany().subscribe(
      (response: { data: Company[] }) => {
        console.log("Companies:", response);
        this.companies = response.data.map(company => ({
          label: company.name ? company.name : "Unnamed Company",
          value: company.id
        }));
      },
      error => {
        console.error('Error fetching companies:', error);
      }
    );
  }
  
  updateStatus(reviewId: number, newStatus: string) {
    const statusNumber = parseInt(newStatus, 10); // Convert string to number if needed
    this.reviewService.changeStatus(reviewId, statusNumber).subscribe(
      (response: ChangeStatusResponse) => {
        this.toastr.success('Status updated successfully');
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
          review.status = newStatus; // Update the status with the new string value
        }
      },
      error => {
        console.log('Error', error);
      }
    );
  }
  filterReviews(): void {
    console.log('Selected Status:', this.selectedStatus);
    if (this.selectedStatus === null) {
      this.reviews = this.allReviews;
    } else {
      this.reviews = this.allReviews.filter(review => review.status === this.selectedStatus);
    }
  }
  showDialog(){
    this.displayDialog = true;

  }
  onSubmit(){
    this.reviewForm.markAllAsTouched();
    if(this.reviewForm.valid){
      const reviewValue: AddReview = this.reviewForm.value;
      // const formData =  this.reviewForm.value;
      if(this.isEditMode && this.reviews){
        // this.reviewService.updateReview(this.selectedReviews.id).subscribe(
      }
      else{

        let obj:AddReview = {
          company_id: reviewValue.company_id,
          rating: reviewValue.rating,
          comment: reviewValue.comment
      };
        this.reviewService.addreview(obj).subscribe(
          (response: Review) => {
            this.toastr.success('Product updated successfully', 'Success');
            this.displayDialog = false;
            this.reviewForm.reset();
          },
          error => {
            console.log('Error', error);
            this.toastr.error('Error Adding Review','Error');
          }
        ); 
      }
  }
}
  closeDialog(){

  }
  deleteSelectedReviews() : void {
    
  }
  
}
