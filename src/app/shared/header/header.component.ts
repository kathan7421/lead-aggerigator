import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  showLoader = true;

  ngOnInit() {
    // Simulate data loading or initialization process
    this.loadData().then(() => {
      this.showLoader = false;
    });
  }
  async loadData() {
    // Simulate an async data loading process
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000); // Adjust the time as per your requirement
    });
  }
}