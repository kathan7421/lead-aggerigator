import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { BannersService } from './banners.service';
import { ToastrService } from 'ngx-toastr';
import { Banners } from './banners.model';
import { AuthService } from 'src/app/auth-service.service';
import Swal from 'sweetalert2';
import { error } from 'jquery';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.css']
})
export class BannersComponent implements OnInit {
  bannerForm! : FormGroup;
  banners: Banners[] = [];
  selectedBanners: any[] =[];
  imagePreviewUrl: string | ArrayBuffer = '';
  visible: boolean = false;
  isEditMode: boolean = false;
  selectedFile: File | null = null;
  selectedBanner!: Banners;
  constructor(public dialogService: DialogService ,private fb: FormBuilder,private bannerService: BannersService,private toastr: ToastrService,private authService:AuthService,public route:ActivatedRoute) { 
this.bannerForm = this.fb.group({
  title: ['', Validators.required],
  image: [''],
  button_text	: [''],
  priority: [''],
  slug: [''],
  description: ['', Validators.required],
});
// Set validators for image control based on edit mode
this.bannerForm.get('image')?.setValidators(this.isEditMode ? null : Validators.required);
this.bannerForm.get('image')?.updateValueAndValidity();
}
ngOnInit(): void {
  
  this.loadBanners();
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
  openEditDialog(bannerId: number) {
    this.bannerService.getBannerById(bannerId).subscribe(
      (response: { data: Banners }) => {
        this.selectedBanner = response.data;
        this.isEditMode = true;
        this.bannerForm.patchValue({
          title: this.selectedBanner.title,
          priority: this.selectedBanner.priority,
          button_text: this.selectedBanner.button_text,
          description: this.selectedBanner.description,
          image: ''
        });
        this.imagePreviewUrl = this.selectedBanner.image;
        this.selectedFile = null; // Reset selected file
        // this.uploadedImageUrl = null; // Reset uploaded image URL
        this.visible = true;
        this.bannerForm.get('image')?.clearValidators();
        this.bannerForm.get('image')?.updateValueAndValidity();
      },
      (error) => {
        this.toastr.error('Something went wrong', 'Error');
      }
    );
  }
  getAllBanners(){
    this.bannerService.getBanners().subscribe(res => {
      this.banners = res.banners;
    }) 
  }
  
  loadBanners(): void {
    if (this.authService.isLoggedIn()) {
      this.route.data.subscribe((data: any) => {
        this.banners = data.banners.banners; // Access 'banners' using ['banners']
        console.log('Banners fetched successfully:', this.banners);
      },
        (error) => {
          console.error('Error fetching banners:', error);
        }
      );
    }
  }
  onSubmit(): void {
    this.bannerForm.markAllAsTouched();
    if (this.bannerForm.valid) {
      const formData: Banners = this.bannerForm.value;
      
      if (this.isEditMode) {
        if (this.selectedFile) {
          const reader = new FileReader();
          reader.onload = () => {
            formData.image = reader.result as string; // Ensure reader.result is treated as string
            this.submitForm(formData);
          };
          reader.readAsDataURL(this.selectedFile);
        } else {
          formData.image = '';  // Set image value to empty string if not uploading a new image during editing
          this.submitForm(formData);
        }
      } else {
        // If it's not in edit mode, directly use imagePreviewUrl
        formData.image = this.imagePreviewUrl as string; // Cast imagePreviewUrl as string
        this.submitForm(formData);
        this.bannerForm.markAllAsTouched();
      }
    }
  }
submitForm(formData:any){
  if(this.isEditMode){
    this.bannerService.upateBanners(this.selectedBanner.id,formData).subscribe(
     (response) => {
      this.toastr.success('Banner updated successfully', 'Success');
      this.closeDialog();
      this.getAllBanners();
      // this.loadBanners();
     },
     (error) => {
      this.toastr.error('Something went wrong', 'Error');
     }
    );

}else{
  this.bannerService.addBanner(formData).subscribe(
    (response) => {
      this.toastr.success('Banner added successfully', 'Success');
      this.closeDialog();
      this.getAllBanners();
},
(error) => {
  this.toastr.error('Something Went Wrong','error');
}
  );
}
 
}
  
  
  showDialog() {
    this.visible = true;
    this.isEditMode = false;
    this.bannerForm.reset();
    this.imagePreviewUrl = '';
    this.selectedFile = null; // Reset selected file
  }
  
  
closeDialog() {
    this.visible = false;
    this.bannerForm.reset();
    this.imagePreviewUrl = '';
    this.isEditMode = false;
    this.selectedFile = null; // Reset selected file to null
    // this.uploadedImageUrl = null;
    this.bannerForm.get('image')?.setValidators(this.isEditMode ? null : Validators.required);
    this.bannerForm.get('image')?.updateValueAndValidity();
  }
  deleteBanner(bannerId:number) : void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Banner!',
      icon: 'warning',
      showCancelButton:true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bannerService.deleteBanner(bannerId).subscribe(
          response => {
            this.loadBanners();
            Swal.fire('Deleted!', 'Banner has been deleted.', 'success');
          },
          error => {
            Swal.fire('Error!','Failed to delete the Banner.','error');
    }
  );
} else if (result.dismiss === Swal.DismissReason.cancel) {
  Swal.fire('Cancelled', 'The Banner is safe :)', 'info');
}
    });
}
changeBannerStatus(bannerId:number,checked:boolean): void {
  const newStatus =  checked ? 1 : 0;
  this.bannerService.updateBannerStatus(bannerId,newStatus).subscribe(
    (response: Banners) => {
      const message = newStatus === 1 ? 'You have made the status Active' : 'You have made the status Inactive';
      this.toastr.success(message,'Banner Status updated Successfully');
    },
    error => {
     this.toastr.error('Something Went Wrong',error);
    }
  )
}
deleteSelectedBanners(): void {
  if (this.  selectedBanners.length === 0) {
    Swal.fire('No Selection', 'Please select at least one banner to delete.', 'info');
    return;
  }

  const bannerIds = this.selectedBanners.map(banner => banner.id);

  Swal.fire({
    title: 'Are You Sure?',
    text: 'You will not be able to recover these Banners!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete them!',
    cancelButtonText: 'No, keep them'
  }).then((result) => {
    if (result.isConfirmed) {
      this.bannerService.deleteAll(bannerIds).subscribe(
        response => {
          this.banners = this.banners.filter(banner => !bannerIds.includes(banner.id));
          this.selectedBanners = [];
          Swal.fire('Deleted!', 'The selected banners have been deleted.', 'success');
        },
        error => {
          console.error('Error deleting banners:', error);
          Swal.fire('Error!', 'Failed to delete the selected banners.', 'error');
        }
      );
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('Cancelled', 'The selected banners are safe :)', 'info');
    }
  });
}
}