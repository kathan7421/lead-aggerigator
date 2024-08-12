import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as he from 'he'; // Import he library for decoding HTML entities

@Component({
  selector: 'app-cmspages',
  templateUrl: './cmspages.component.html',
  styleUrls: ['./cmspages.component.css']
})
export class CmspagesComponent implements OnInit {
  cmsPage: { title: string, content: SafeHtml } = { title: '', content: '' };

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router // Import Router for navigation
  ) {}

  ngOnInit(): void {
    const data = this.route.snapshot.data['cmsPages']; // Ensure this matches the resolver key
    if (data) {
      // Clean and decode HTML content
      const cleanedContent = this.cleanHtml(data.content);
      const decodedContent = he.decode(cleanedContent);
      this.cmsPage = {
        title: data.title,
        content: this.sanitizer.bypassSecurityTrustHtml(decodedContent)
      };
    } else {
      this.router.navigate(['/not-found']);
    }
  }

  cleanHtml(dirtyHtml: string): string {
    // Remove <div class="ql-code-block"> elements
    const cleanedHtml = dirtyHtml.replace(/<div class="ql-code-block">/g, '')
                                 .replace(/<\/div>/g, '');
    return cleanedHtml;
  }
}
