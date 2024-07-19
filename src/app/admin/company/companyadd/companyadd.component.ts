import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompanyserviceService } from '../companyservice.service';
import { AuthService } from 'src/app/auth-service.service';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../company.model'; // Import your Company model or use any[]
import { LocationService } from 'src/app/shared/location/location.service';
import { emailExistsValidator } from 'src/app/shared/email-exists.validator';
import { EmailCheckService } from 'src/app/shared/email-check.service';


@Component({
  selector: 'app-companyadd',
  templateUrl: './companyadd.component.html',
  styleUrls: ['./companyadd.component.css']
})
export class CompanyaddComponent implements OnInit {
  companies: Company = new Company();
  companyForm!: FormGroup;
  logoFile: string | null = null;
  coverPhotoFile: string | null = null;
  documentFile: string | null = null;
  countries: any[] = []; // Use any[] if not using specific models
  states: any[] = [];
  cities: any[] = [];
  logoPreview: string | ArrayBuffer | null = null;
  coverPhotoPreview:  string | ArrayBuffer | null = null;
  documentPreview: File | null = null;
  errorMessage: string = '';
  disablebtn: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private companyService: CompanyserviceService,
    public toastr: ToastrService,
    public authService: AuthService,
    public route: ActivatedRoute,
    private locationService: LocationService,
    private userService: EmailCheckService,
  ) {}

  ngOnInit(): void {
    this.companyForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email],
      [emailExistsValidator(this.userService, this.companies?.user_id || 0)]
    ],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      logo: [''],
      fax: [''],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(10)
        ]
      ],
      website: ['', [Validators.required, Validators.pattern('https?://.+')]],
      cover_photo: [''],
      description: [''],
      document: [''],
      gst_number: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      register_number: [''],
      tag_line: ['', Validators.required]
    });
    
    if (this.companyForm.valid) {
      this.disablebtn = false;
    }
  }

  onCountryChanged(countryId: number): void {
    this.companyForm.patchValue({
      country: countryId
    });
    this.loadStates(countryId);
  }

  onStateChanged(stateId: number): void {
    this.companyForm.patchValue({
      state: stateId
    });
    this.loadCities(stateId);
  }

  onCityChanged(cityId: number): void {
    this.companyForm.patchValue({
      city: cityId
    });
  }

  loadStates(countryId: number): void {
    // Example: Load states based on countryId from your service
    // Replace with your actual service call
    this.locationService.getStates(countryId).subscribe(data => {
      this.states = data;
    });
  }

  loadCities(stateId: number): void {
    // Example: Load cities based on stateId from your service
    // Replace with your actual service call
    this.locationService.getCities(stateId).subscribe(data => {
      this.cities = data;
    });
  }


  onFileChange(event: Event, field: string): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      if (file) {
        this.encodeFileToBase64(file, field);
      }
    }
  }

  encodeFileToBase64(file: File, field: string): void {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      if (field === 'logo') {
        this.logoFile = base64String;
        this.companies.logo = base64String; // Assign base64 string to company model if needed
      } else if (field === 'cover_photo') {
        this.coverPhotoFile = base64String;
        this.companies.cover_photo = base64String; // Assign base64 string to company model if needed
      } else if (field === 'document') {
        this.documentFile = base64String;
        this.companies.document = base64String; // Assign base64 string to company model if needed
      }
    };
    reader.readAsDataURL(file);
  }
  
  previewImage(file: File, field: string): void {
    const reader = new FileReader();
    reader.onload = () => {
      if (field === 'logo') {
        this.logoPreview = reader.result;
      } else if (field === 'cover_photo') {
        this.coverPhotoPreview = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }
  resetForm(): void {
    this.companyForm.reset();
    this.logoFile = null;
    this.coverPhotoFile = null;
    this.documentFile = null;
    this.logoPreview = null;
    this.coverPhotoPreview = null;
    this.disablebtn = true;
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      this.disablebtn = false;
      this.companies = { ...this.companies, ...this.companyForm.value };
      this.companies.logo = this.logoFile; // Assign base64 encoded logo
      this.companies.cover_photo = this.coverPhotoFile; // Assign base64 encoded cover photo
      this.companies.document = this.documentFile; // Assign base64 encoded document
      this.companyService.addCompany(this.companies).subscribe(
        response => {
          console.log('Company added successfully!', response);
          this.toastr.success('Company added successfully!');
          this.companyService.getCompany();
          this.companyForm.reset();
          this.resetForm();
          this.disablebtn = true;
        },
        (error) => {
          console.error('Failed to add company:', error);
          if (error.status === 400 && error.error && error.error.error) {
            // Handle validation errors
            this.toastr.error(error.error.error.join(', '));
            // Check if the email already exists error is present
            if (error.error.error.includes('The email has already been taken.')) {
              this.companyForm.get('email')?.setErrors({ emailExists: true });
            }
          } else {
            this.toastr.error('Failed to add company. Please try again later.');
          }
          this.disablebtn = false;
        }
      );
    } else {
      this.companyForm.markAllAsTouched(); // Mark all fields as touched to display validation messages
    }
  }

  // Helper method to check if a form control has a specific error
  hasError(controlName: string, errorName: string): boolean {
    return this.companyForm.get(controlName)?.hasError(errorName) || false;
  }
}