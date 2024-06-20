import { Component, OnInit } from '@angular/core';
import { CmspagesService } from './cmspages.service';
import { ActivatedRoute } from '@angular/router';
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
    private cmsService: CmspagesService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.cmsService.getCmsPage(slug!).subscribe(data => {
      console.log(data.content); // Log to check the content received
      const cleanedContent = this.cleanHtml(data.content); // Clean HTML content
      const decodedContent = he.decode(cleanedContent); // Decode HTML entities
      this.cmsPage = {
        title: data.title,
        content: this.sanitizer.bypassSecurityTrustHtml(decodedContent)
      };
    });
  }

  cleanHtml(dirtyHtml: string): string {
    // Remove <div class="ql-code-block"> elements
    const cleanedHtml = dirtyHtml.replace(/<div class="ql-code-block">/g, '')
                                 .replace(/<\/div>/g, '');
    return cleanedHtml;
  }
}
