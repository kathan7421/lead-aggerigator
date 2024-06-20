import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  //   $(document).ready(() => {
  //     // Ensure sidebar toggle works
  //     $('[data-widget="pushmenu"]').on('click', e => {
  //       e.preventDefault();
  //       // Toggle sidebar state
  //       $('body').toggleClass('sidebar-collapse');
  //     });
  //   });
  // }
  }

}
