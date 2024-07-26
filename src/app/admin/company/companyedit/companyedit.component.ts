import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyserviceService } from '../companyservice.service';
import { AuthService } from 'src/app/auth-service.service';
import { Company } from '../company.model';
import { LocationService } from 'src/app/shared/location/location.service';
import { User } from '../../user/user.model';
import { emailExistsValidator } from 'src/app/shared/email-exists.validator';
import { EmailCheckService } from 'src/app/shared/email-check.service';

@Component({
  selector: 'app-companyedit',
  templateUrl: './companyedit.component.html',
  styleUrls: ['./companyedit.component.css']
})
export class CompanyeditComponent implements OnInit {

  companyForm!: FormGroup;
  companyId!: number;
  company: Company | null = null;
  user: User | null = null;
  logoPreview: string | null = null;
  document: string | null = null;
  coverPhotoPreview: string | null = null;
  documentPreview: string | null = null;
  selectedLogoFile: File | null = null;
  selectedCoverPhotoFile: File | null = null;
  selectedocumentFile: File | null = null;
  disablebtn: boolean = true;
  states: any;
  cities: any[] = [];
  countries: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private companyService: CompanyserviceService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private locationService: LocationService, // Assuming you have a service to fetch locations
    private userService:EmailCheckService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.companyId = +params.get('id')!;
    });
    this.companyForm = this.formBuilder.group({
      // company: this.formBuilder.group({

      // }),
      company: this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email], [emailExistsValidator(this.userService, this.companyId)]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            // Validators.maxLength(10)
          ]
        ],
        phone: ['', Validators.required],
        address: ['', Validators.required],
        logo: [''],
        fax: [''],
        website: ['', [Validators.required, Validators.pattern('https?://.+')]],
        cover_photo: [''],
        description: [''],
        gst_number: [''],
        country: ['', Validators.required],
        state: ['', Validators.required],
        city: ['', Validators.required],
        register_number: [''],
        document: [''],
        tag_line: ['', Validators.required]
      })
    });
  
    
  
    this.route.data.subscribe((res: any) => {
      console.log(res.company.company);
      let company: Company = res.company.company;
    
      this.companyForm.patchValue({
        company: {
          id: company.id,
          user_id: company.user_id,
          name: company.name,
          description: company.description,
          password: company.password,
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
          tag_line: company.tag_line,
          company: company.status,

          // Add other company fields as needed
        }
        
        
      });
      
      //  console.log(company);
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

    });

    // Fetch company ID from route params
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.companyId = +id;
        // this.loadCompanyDetails(this.companyId);
      } else {
        this.toastr.error('Company ID not found.');
        this.router.navigate(['/admin/company']); // Navigate to company list if ID is not found
      }
    });

    // Check if form is valid to enable/disable submit button
    this.companyForm.valueChanges.subscribe(() => {
      this.disablebtn = !this.companyForm.valid;
    });
  }
  onCountryChanged(event: any): void {
    const countryId = event.target.value;
    this.companyForm.patchValue({ country: countryId });
    this.loadStates(countryId);
  }

  onStateChanged(event: any): void {
    const stateId = event.target.value;
    this.companyForm.patchValue({ state: stateId });
    this.loadCities(stateId);
  }

  onCityChanged(event: any): void {
    const cityId = event.target.value;
    this.companyForm.patchValue({ city: cityId });
  }


  loadStates(countryId: number): void {
    this.locationService.getStates(countryId).subscribe(
      (data: any[]) => {
        this.companyForm.get('state')?.reset();
        this.companyForm.get('city')?.reset();
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
        this.companyForm.get('city')?.reset();
        this.cities = data;
        // console.log(this.cities);
      },
      error => {
        console.error('Error loading cities:', error);
        this.toastr.error('Failed to load cities. Please try again.');
      }
    );
  }

  onFileChange(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        if (field === 'logo') {
          this.logoPreview = base64String;
          // Update form control value without setting file input value
          this.companyForm.patchValue({
            logo: file // Store the file object itself if needed for upload
          });
          this.selectedLogoFile = file;
        } else if (field === 'cover_photo') {
          this.coverPhotoPreview = base64String;
          // Update form control value without setting file input value
          this.companyForm.patchValue({
            cover_photo: file // Store the file object itself if needed for upload
          });
          this.selectedCoverPhotoFile = file;
        }
        else if (field === 'document') {
          this.documentPreview = base64String;
          // Update form control value without setting file input value
          this.companyForm.patchValue({
            document: file // Store the file object itself if needed for upload
          });
          this.selectedocumentFile = file;
        }
      };
      reader.readAsDataURL(file);
    }
  }


  previewImage(file: File, field: string): void {
    const reader = new FileReader();
    reader.onload = () => {
      if (field === 'logo') {
        this.logoPreview = reader.result as string; // Use `reader.result` directly for preview
      } else if (field === 'cover_photo') {
        this.coverPhotoPreview = reader.result as string; // Use `reader.result` directly for preview
      }
      else if (field === 'document') {
        this.documentPreview = reader.result as string; // Use `reader.result` directly for preview
      }
    };
    reader.readAsDataURL(file);
  }


  resetForm(): void {
    this.companyForm.reset();
    // this.logoFile = null;
    // this.coverPhotoFile = null;
    this.logoPreview = null;
    this.documentPreview = null;
    this.coverPhotoPreview = null;
    // this.disablebtn = true;
  }



  onSubmit(): void {
    if (this.companyForm.valid) {
      // const updatedUser = {  };
      const updatedCompany = { ...this.companyForm.value.company };

      if (this.selectedLogoFile) {
        // Handle new logo upload
        updatedCompany.logo = this.logoPreview;

      } else {
        // Handle case where no logo changes were made
        updatedCompany.logo = ''; // Set logo to blank if no new logo selected
      }
      // Handle cover photo update
      if (this.selectedCoverPhotoFile) {
        // Handle new cover photo upload
        updatedCompany.cover_photo = this.coverPhotoPreview;
      } else {

        updatedCompany.cover_photo = ''; // Set cover photo to blank if no new cover photo selected
      }
      if (this.selectedocumentFile) {
        // Handle new cover photo upload
        updatedCompany.document = this.documentPreview;
      } else {

        updatedCompany.document = ''; // Set cover photo to blank if no new cover photo selected
      }
      this.companyService.updateCompany(this.companyId, updatedCompany).subscribe({
        next: (res) => {
          this.toastr.success('Company updated successfully.');

          this.router.navigate(['/admin/company']);
        },
        error: () => {

        }
      });
    } else {
      this.companyForm.markAllAsTouched();
      this.toastr.error('Form is invalid. Please check all fields.');
    
    }
    
  }
 
  hasError(controlName: string, errorName: string): boolean {
    return this.companyForm.get(controlName)?.hasError(errorName) || false;
  }
}  