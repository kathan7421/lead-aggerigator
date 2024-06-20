import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CmsserviceService } from './cmsservice.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth-service.service';
import { Cms } from './cms.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.css']
})
export class CmsComponent implements OnInit {
  isEditMode: boolean = false;
  displayDialog: boolean = false;
  cmsForm!: FormGroup;
  cms: Cms[] = [];
  selectedcms!: Cms;

  constructor(
    private formBuilder: FormBuilder,
    private cmsService: CmsserviceService,
    private toastr: ToastrService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCms();
  }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  initForm(): void {
    this.cmsForm = this.formBuilder.group({
      id: [null], // Optional if editing existing CMS content
      title: ['', Validators.required],
      content: ['', Validators.required],
      slug: ['']
    });
  }

  showDialog(): void {
    this.displayDialog = true;
    this.isEditMode = false;
    this.cmsForm.reset();
  }

  openEditDialog(cmsId: number) {
    this.cmsService.getCmsById(cmsId).subscribe(
      (response: { data: Cms }) => {
        this.selectedcms = response.data;
        console.log('Selected CMS:', this.selectedcms);

        this.isEditMode = true;
        this.cmsForm.patchValue({
          id: this.selectedcms.id,
          title: this.selectedcms.title,
          content: this.selectedcms.content,
          slug: this.selectedcms.slug,
        });

        // Ensure the dialog and editor are properly updated
        setTimeout(() => {
          this.displayDialog = true;
          this.cdr.detectChanges(); // Trigger change detection
          this.forceEditorUpdate(this.selectedcms.content); // Manually update editor content
          console.log('Form after patchValue:', this.cmsForm.value);
        }, 0);
      },
      (error) => {
        this.toastr.error('Something went wrong', 'Error');
      }
    );
  }

  forceEditorUpdate(content: string) {
    const editorElement = document.querySelector('.ql-editor');
    if (editorElement) {
      editorElement.innerHTML = content;
    }
  }
  onSubmit(): void {
    if (this.cmsForm.valid) {
      const formData: Cms = this.cmsForm.value;
      if (this.isEditMode) {
        // Update existing CMS content
        this.cmsService.updateCms(formData.id, formData).subscribe(
          (response) => {
            this.toastr.success('CMS content updated successfully.');
            this.closeDialog();
            this.loadCms();
          },
          (error) => {
            this.toastr.error('Failed to update CMS content.');
            console.error('Update Error:', error);
          }
        );
      } else {
        // Add new CMS content
        this.cmsService.addCms(formData).subscribe(
          (response) => {
            this.toastr.success('New CMS content added successfully.');
            this.closeDialog();
               this.loadCms();
          },
          (error) => {
            this.toastr.error('Failed to add new CMS content.');
            console.error('Add Error:', error);
          }
        );
      }
    } else {
      this.cmsForm.markAllAsTouched();
    }
  }

  loadCms() {
    this.cmsService.getCms().subscribe(
      (response: { data: Cms[] }) => {
        this.cms = response.data;
        console.log('Cms fetched Successfully', this.cms);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  changeCmsStatus(cmsId: number, checked: boolean) {
    const newStatus = checked ? 1 : 0;
    this.cmsService.updateCmsStatus(cmsId, newStatus).subscribe(
      (response: Cms) => {
        const message = newStatus === 1 ? 'You Have Made the Status Active' : 'You have Made the Status Inactive';
        this.toastr.success(message, 'Cms Pages Status Updated Successfully');
      },
      (error) => {
        console.error('Error Changing Status', error);
      }
    );
  }

  closeDialog(): void {
    this.displayDialog = false;
    this.isEditMode = false;
    this.cmsForm.reset();
  }


deleteCms(cmsId:number){
  Swal.fire({
    title: 'Are You Sure?',
    text: 'You will not be able to recover this Cms! ',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it'
     }).then((result) => {
       if (result.isConfirmed) {
         this.cmsService.deleteCms(cmsId).subscribe(
           response => {
             console.log('Cms deleted successfully:', response);
             this.loadCms();
             Swal.fire('Deleted!', 'The Cms has been deleted.', 'success');
           },
           error => {
             console.error('Error deleting Country:', error);
             // Handle error, such as displaying an error message
             Swal.fire('Error!', 'Failed to delete the Product.', 'error');
           }
         );
       } else if (result.dismiss === Swal.DismissReason.cancel) {
         Swal.fire('Cancelled', 'The Cms is safe :)', 'info');
       }
     });
   }
  }
//    onSubmit(): void {
//     if (this.cmsForm.valid) {
//       const formData: Cms = this.cmsForm.value;
//       if (this.isEditMode) {
//         // Update existing CMS content
//         this.cmsService.updateCms(formData.id, formData).subscribe(
//           (response) => {
//             this.toastr.success('CMS content updated successfully.');
//             this.closeDialog();
//             this.loadCms();
//           },
//           (error) => {
//             this.toastr.error('Failed to update CMS content.');
//             console.error('Update Error:', error);
//           }
//         );
//       } else {
//         // Add new CMS content
//         this.cmsService.addCms(formData).subscribe(
//           (response) => {
//             this.toastr.success('New CMS content added successfully.');
//             this.closeDialog();
//           },
//           (error) => {
//             this.toastr.error('Failed to add new CMS content.');
//             console.error('Add Error:', error);
//           }
//         );
//       }
//     } else {
//       this.cmsForm.markAllAsTouched();
//     }
//   }
// loadCms(){
//   // if (this.authService.isLoggedIn()) {
//   this.cmsService.getCms().subscribe(
//     (response: {data: Cms[]}) => {
//     this.cms = response.data;
//       console.log('Cms feached Successfully',this.cms);
//     },
//     (error) => {
//       console.error('Error:', error);
//     }
//   );
// // }
// }
// changeCmsStatus(cmsId:number,checked:boolean){
//   const newStatus = checked ? 1 : 0 ;
//   this.cmsService.updateCmsStatus(cmsId,newStatus).subscribe(
//     (response: Cms) => {
//       const message = newStatus === 1 ? 'You Have Made the Status Active' : 'You have Made the Status Inactive';
//       this.toastr.success(message,'Cms Pages Status Updated Successfully');
//     },
//     error => {
//       console.error('Error Changing Status',error);
//     }
//   );
// }
//   closeDialog(): void {
//     this.displayDialog = false;
//     this.isEditMode = false;
//     this.cmsForm.reset();
  
//   }
// }
