import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyserviceService } from '../companyservice.service';
import { LocationService } from 'src/app/shared/location/location.service';
import { ToastrService } from 'ngx-toastr';
import { Company } from '../company.model';
import { User } from '../../user/user.model';

@Component({
  selector: 'app-companyview',
  templateUrl: './companyview.component.html',
  styleUrls: ['./companyview.component.css']
})
export class CompanyviewComponent implements OnInit {
  companyviewForm!: FormGroup;
  companyId!: number;
  company: Company | null = null;
  user: User | null = null;
  logoPreview: string | null = null;
  documentPreview: string | null = null;
  coverPhotoPreview: string | null = null;
  selectedLogoFile: File | null = null;
  selectedCoverPhotoFile: File | null = null;
  selectedDocumentFile: File | null = null;
  disablebtn: boolean = true;
  states: any;
  cities: any[] = [];
  countries: any[] = [];

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyserviceService,
    private locationService: LocationService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initForm();
    // Fetch company ID from route params
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.companyId = +id;
        this.loadCompanyDetailsView(this.companyId);
      } else {
        this.toastr.error('Company ID not found.');
        this.router.navigate(['/admin/company']); // Navigate to company list if ID is not found
      }
    });
   }

  initForm(): void {
    this.companyviewForm = this.fb.group({
    company: this.fb.group({
        id: [''],
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [''],
        description: [''],
        fax: [''],
        phone: ['', Validators.required],
        website: [''],
        address: [''],
        logo: [''],
        cover_photo: [''],
        country: [''],
        city: [''],
        register_number: [''],
        gst_number: [''],
        state: [''],
        document: [''],
        slug: [''],
        tag_line: ['']
      })
    });
  }

  loadCompanyDetailsView(companyId: number): void {
    this.companyService.getCompanyById(companyId).subscribe(
      (response: { company: Company }) => {
        const { company } = response;

        // Patch user and company data to the form
        this.companyviewForm.patchValue({
        
          company: {
            id: company.id,
            user_id:company.user_id,
            name: company.name,
            password:company.password,
            description: company.description,
            fax: company.fax,
            email: company.email,
            phone: company.phone,
            website: company.website,
            address: company.address,
            logo: company.logo,
            cover_photo: company.cover_photo,
            country: company.country,
            city: company.city,
            register_number: company.register_number,
            gst_number: company.gst_number,
            state: company.state,
            document: company.document,
            slug: company.slug,
            tag_line: company.tag_line
          }
        });

        if (company.logo) {
          this.logoPreview = company.logo;
        }
        if (company.cover_photo) {
          this.coverPhotoPreview = company.cover_photo;
        }
        if (company.document) {
          this.documentPreview = company.document;
        }

        // Load states and cities based on the fetched company's country and state
        const countryId = company.country ? +company.country : null;
        const stateId = company.state ? +company.state : null;
  
        if (countryId !== null) {
          this.loadStates(countryId);
        }
  
        if (stateId !== null) {
          this.loadCities(stateId);
        }
  
        this.locationService.getCountries().subscribe(
          (countries: any[]) => {
            this.countries = countries; // Assign fetched countries to the component's countries property
          },
          error => {
            console.error('Error loading countries:', error);
            this.toastr.error('Failed to load countries. Please try again.');
          }
        );
  
        // Fetch and set state name
        this.locationService.getStates(countryId!).subscribe(
          (states: any[]) => {
            this.states = this.states; // Set state name for display
          },
          error => {
            console.error('Error loading States:', error);
            this.toastr.error('Failed to load States. Please try again.');
          }
        );
        this.companyviewForm.disable();
      },
      error => {
        console.error('Error loading company details:', error);
        this.toastr.error('Failed to load company details. Please try again.');
        this.router.navigate(['/admin/company']);
      }
    );
  }
  onCountryChanged(event: any): void {
    const countryId = event.target.value;
    this.companyviewForm.patchValue({ country: countryId });
    this.loadStates(countryId);
  }

  onStateChanged(event: any): void {
    const stateId = event.target.value;
    this.companyviewForm.patchValue({ state: stateId });
    this.loadCities(stateId);
  }
  
  onCityChanged(event: any): void {
    const cityId = event.target.value;
    this.companyviewForm.patchValue({ city: cityId });
  }
  

  loadStates(countryId: number): void {
    this.locationService.getStates(countryId).subscribe(
      (data: any[]) => {
        this.companyviewForm.get('state')?.reset();
        this.companyviewForm.get('city')?.reset();
        this.states = data; // Assign retrieved states to the component's states property
      },
      error => {
        console.error('Error loading states:', error);
        this.toastr.error('Failed to load states. Please try again.');
      }
    );
  }

  loadCities(stateId: number): void {
    this.locationService.getCities(stateId).subscribe(
      (data: any[]) => {
        this.companyviewForm.get('city')?.reset();
        this.cities = data;
        // console.log(this.cities);
      },
      error => {
        console.error('Error loading cities:', error);
        this.toastr.error('Failed to load cities. Please try again.');
      }
    );
  }
}