import { Component, OnInit } from '@angular/core';
import { ReviewsService } from './reviews.service';
import { Review } from './reviews.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  reviews: Review[] = [];
  allReviews: Review[] = [];
  loading: boolean = true;
  statusOptions = [
    { label: 'All', value: null },
    { label: 'Pending', value: 1 },
    { label: 'Approved', value: 2 },
    { label: 'Rejected', value: 3 }
  ];
  selectedStatus: number | null = null;

  constructor(private reviewService: ReviewsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      (response: any) => {
        this.reviews = response.data.data; // Extract the data array from the response
        this.allReviews = response.data.data;
        console.log('Reviews fetched successfully', this.reviews);
        this.loading = false;
      },
      error => {
        console.error('Error fetching data', error);
      }
    );
  }

  filterReviews(): void {
    if (this.selectedStatus === null) {
      this.reviews = this.allReviews;
    } else {
      this.reviews = this.allReviews.filter(review => review.status === this.selectedStatus);
    }
  }
}
