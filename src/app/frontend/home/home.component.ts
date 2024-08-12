import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
// declare var $: any; // Import jQuery
import 'slick-carousel'; // Ensure Slick Carousel is imported

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
  }
  items = [
    { image: 'https://iss-worldwidemovers.om/wp-content/uploads/al_opt_content/IMAGE/iss-worldwidemovers.om//wp-content/uploads/2024/07/h5-3-copy-1-1.webp.bv.webp?bv_host=iss-worldwidemovers.om' },
    { image: 'https://via.placeholder.com/800x400?text=Slide+2' },
    { image: 'https://via.placeholder.com/800x400?text=Slide+3' }
  ];

  ngAfterViewInit(): void {
    // Initialize Slick Carousel
    ($ as any)('.slider').slick({
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,         // Enable autoplay
      autoplaySpeed: 2000,    // Set autoplay speed (in milliseconds)
      arrows: true,           // Show navigation arrows
      pauseOnHover: true,     // Pause on hover
      pauseOnDotsHover: true  // Pause on dots hover
    });
  }

}
