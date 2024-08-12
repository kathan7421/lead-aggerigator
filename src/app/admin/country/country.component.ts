import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from './country.service';
import { ChangeStatusResponse, Country } from './country.model'; 
import { DialogService } from 'primeng/dynamicdialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth-service.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  @ViewChild('dt2') dt2!: Table;
  countryForm!: FormGroup;
  imagePreviewUrl: string | ArrayBuffer = ''; // Initialize with an empty string
  isEditMode: boolean = false;
  countries: Country[] = [];   // Initializing a new instance of Country
  displayDialog: boolean = false;
  selectedCountry!: Country;
  selectCountry: any[] =[];
  selectedFile: File | null = null; // Variable to hold the selected file
  // uploadedImageUrl: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private countryService: CountryService,
    public dialogService: DialogService,
    public toastr: ToastrService,
    public authService: AuthService,
    public route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.countryForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      image: ['']
    });
    this.loadCountries();
  }
onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.imagePreviewUrl = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  filterGlobal(event: Event): void {
    // Ensure `event.target` is an HTMLInputElement
    const input = event.target as HTMLInputElement;
    this.dt2.filterGlobal(input.value, 'contains');
  }
  
  

openEditDialog(countryId: number) {
    this.countryService.getCountryById(countryId).subscribe(
      (response: { data: Country }) => {
        this.selectedCountry = response.data;
        this.isEditMode = true;
        this.countryForm.patchValue({
          name: this.selectedCountry.name,
          description: this.selectedCountry.description,
          image: ''
        });
        this.imagePreviewUrl = this.selectedCountry.image;
        this.selectedFile = null; // Reset selected file
        // this.uploadedImageUrl = null; // Reset uploaded image URL
        this.displayDialog = true;
      },
      (error) => {
        this.toastr.error('Something went wrong', 'Error');
      }
    );
  }
  
  onSubmit() {
    this.countryForm.markAllAsTouched(); // Mark all form controls as touched to trigger validation
    if (this.countryForm.valid) {
      const formData = this.countryForm.value;
      if (this.isEditMode) {
        if (this.selectedFile) {
          const reader = new FileReader();
          reader.onload = () => {
            formData.image = reader.result as string;
            this.submitForm(formData);
          };
          reader.readAsDataURL(this.selectedFile);
        } else {
          formData.image = '';  // Set image value to empty string if not uploading a new image during editing
          this.submitForm(formData);
        }
      } else {
        // If it's not in edit mode, directly call submitForm without making API call
        formData.image = this.imagePreviewUrl;
        this.submitForm(formData);
        this.countryForm.markAllAsTouched();
      }
    }
  }
  
submitForm(formData: any) {
      if (this.isEditMode) {
      this.countryService.updateCountry(this.selectedCountry.id, formData).subscribe(
        (response) => {
          this.toastr.success('Country updated successfully', 'Success');
          this.closeDialog();
          this.getAllCountry();
        },
        (error) => {
          this.toastr.error('Something went wrong', 'Error');
        }
      );
    } else {
      
      this.countryService.addCountry(formData).subscribe(
        (response) => {
          this.toastr.success('Country added successfully', 'Success');
          this.closeDialog();
          this.getAllCountry();
        },
        (error) => {
          this.toastr.error('Something went wrong', 'Error');
        }
      );
    }
  }
  showDialog() {
    this.displayDialog = true;
    this.isEditMode = false;
    this.countryForm.reset();
    this.imagePreviewUrl = '';
    this.selectedFile = null; // Reset selected file
  }
  
  
closeDialog() {
    this.displayDialog = false;
    this.countryForm.reset();
    this.imagePreviewUrl = '';
    this.isEditMode = false;
    this.selectedFile = null; // Reset selected file to null
    // this.uploadedImageUrl = null;
  }
  getAllCountry(){
    this.countryService.getCountries().subscribe(res => {
      this.countries = res.data;
    }) 
  }
loadCountries(): void {
  if (this.authService.isLoggedIn()) {
  this.route.data.subscribe((data: any) => {
    this.countries = data.countries.data;
    console.log('Countries fetched successfully:', this.countries);
  });
}
}

changeCountryStatus(countryId:number,checked:boolean) : void {
  const newStatus = checked ? 1 : 0;
  this.countryService.updateCountryStatus(countryId,newStatus).subscribe(
    (response: Country) => {
      const message = newStatus === 1 ? 'You have made the status Active' : 'You have made the status Inactive';
      this.toastr.success(message,'Country Status Updated Successfully');
    },
    error => {
      console.error('Error Changing status',error);
    }
  )
}
deleteCountry(countryId:number) : void {
  Swal.fire({
 title: 'Are You Sure?',
 text: 'You will not be able to recover this Country! ',
 icon: 'warning',
 showCancelButton: true,
 confirmButtonText: 'Yes, delete it!',
 cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.isConfirmed) {
      this.countryService.deleteCountry(countryId).subscribe(
        response => {
          console.log('Product deleted successfully:', response);
          this.getAllCountry();
          Swal.fire('Deleted!', 'The Country has been deleted.', 'success');
        },
        error => {
          console.error('Error deleting Country:', error);
          // Handle error, such as displaying an error message
          Swal.fire('Error!', 'Failed to delete the Product.', 'error');
        }
      );
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('Cancelled', 'The Country is safe :)', 'info');
    }
  });
}
deleteSelectedCountry(): void {
  if (this.selectCountry.length === 0) {
    Swal.fire('No Selection', 'Please select at least one Country to delete.', 'info');
    return;
  }

  const countryIds = this.selectCountry.map(country => country.id);

  Swal.fire({
    title: 'Are You Sure?',
    text: 'You will not be able to recover these Countries!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete them!',
    cancelButtonText: 'No, keep them'
  }).then((result) => {
    if (result.isConfirmed) {
      this.countryService.deleteAll(countryIds).subscribe(
        response => {
          this.countries = this.countries.filter(country => !countryIds.includes(country.id));
          this.selectCountry = [];
          Swal.fire('Deleted!', 'The selected country have been deleted.', 'success');
        },
        error => {
          console.error('Error deleting banners:', error);
          Swal.fire('Error!', 'Failed to delete the selected countries.', 'error');
        }
      );
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('Cancelled', 'The selected countries are safe :)', 'info');
    }
  });
}
}

