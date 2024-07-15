import { Component, OnInit } from '@angular/core';
import { CategoryService } from './category-service.service';
import { AuthService } from 'src/app/auth-service.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { SelectItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: any[] = [];
  selectedCategories: any[] = [];
  editingCategory: any;
  display: boolean = false;
  categoryForm!: FormGroup;
  isEditMode: boolean = false;
  categoriesnew!: SelectItem[];
  visible: boolean = false;
  uploadedImageUrl!: string;
  base64textString: string | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public dialogService: DialogService,
    public route:ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: ['']
    });
    this.loadCategories();
  }

  showDialog(category?: any) {
    this.categoryForm.reset();
    this.visible = true;
    this.isEditMode = false;
    this.imagePreviewUrl = null;
    if (category) {
      this.editingCategory = category;
      this.categoryForm.patchValue({
        name: category.name,
        description: category.description
      });
      this.imagePreviewUrl = category.image; // Display old image if available
      this.isEditMode = true;
    } else {
      this.editingCategory = null;
      this.categoryForm.reset();
    }
    this.display = true;
  }
  onFileChange(event: any): void {
    const files = event.target.files;
    const file = files[0];
  
    if (files && file) {
      const reader = new FileReader();
  
      reader.onload = () => {
        this.base64textString = reader.result as string;
        this.categoryForm.patchValue({ image: this.base64textString });
        this.uploadedImageUrl = reader.result as string;
        this.imagePreviewUrl = reader.result as string; // Update image preview URL with uploaded image
      };
  
      reader.readAsDataURL(file);
    } else {
      // Clear the image preview if no file is selected
      this.base64textString = null; // Reset base64textString
      this.imagePreviewUrl = null;
    }
  }
  
  
  
  

  deleteSelectedCategories(): void {
    if (this.selectedCategories.length === 0) {
      Swal.fire('No Selection', 'Please select at least one category to delete.', 'info');
      return;
    }
  
    const categoryIds = this.selectedCategories.map(category => category.id);
  
    Swal.fire({
      title: 'Are You Sure?',
      text: 'You will not be able to recover these categories!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete them!',
      cancelButtonText: 'No, keep them'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategoies(categoryIds).subscribe(
          response => {
            this.categories = this.categories.filter(category => !categoryIds.includes(category.id));
            this.selectedCategories = [];
            Swal.fire('Deleted!', 'The selected categories have been deleted.', 'success');
          },
          error => {
            console.error('Error deleting categories:', error);
            Swal.fire('Error!', 'Failed to delete the selected categories.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The selected categories are safe :)', 'info');
      }
    });
  }
  

  getPreviewImage(): string | ArrayBuffer | null {
    if (!this.base64textString && this.imagePreviewUrl) {
      return this.imagePreviewUrl; // Display old image if not updating
    } else if (this.imagePreviewUrl && this.base64textString) {
      return this.base64textString; // Display new image if updating
    }
    return null;
  }
  
  onSubmit(): void {
    this.markAllAsTouched();
    if (this.categoryForm.valid) {
      const formData = this.categoryForm.value;
      if (this.isEditMode) {
        // Check if a new image is uploaded or if the existing image is removed
        if (this.base64textString && this.categoryForm.value.image != null) {
          // New image uploaded, update the image data
          formData.image = this.base64textString;
          this.imagePreviewUrl = this.base64textString;
        } else {
          // No new image uploaded, check if the editing category has an image
          if (this.editingCategory.image) {
            // Retain the existing image if it exists
            formData.image = '';
            this.imagePreviewUrl = this.editingCategory.image; // Show old image
          } else {
            // No existing image, set image property to null
            formData.image = null;
            this.imagePreviewUrl = this.editingCategory.image; // Clear image preview
          }
        }
        this.updateCategory(this.editingCategory.id, formData);
      } else {
        // Add new category
        this.addCategory(formData);
      }
    } else {
      // Handle form validation errors
      this.toastr.error('Please fill in all required fields.');
    }
  }
  
  
  
  setEditMode(isEdit: boolean) {
    this.isEditMode = isEdit;
  }
  openEditDialog(categoryId: number): void {
    this.setEditMode(true);
    this.categoryForm.reset();
    this.categoryService.getCategoryById(categoryId).subscribe(
      (response: any) => {
        console.log('Category response:', response); // Log the response to see the data structure
  
        this.editingCategory = response.data;
        // Set the form values without the image
        this.categoryForm.patchValue({
          name: response.data.name,
          description: response.data.description,
          // Do not patch the image value here
        });
  
        // Check if a new image is uploaded; if not, display the old image
        const imageControl = this.categoryForm.get('image');
        if (imageControl !== null && !imageControl.value && !this.base64textString) {
          // If no new image is selected and no base64 string exists, set uploadedImageUrl to the existing image URL
          this.uploadedImageUrl = response.data.image;
          this.imagePreviewUrl = response.data.image; // Set the image preview URL
        }
  
        this.visible = true;
      },
      error => {
        console.error('Error fetching category details:', error);
      }
    );
  }
  
  
  hideDialog() {
    this.display = false;
    this.visible = false;
  }

  addCategory(newCategoryData: any): void {
    this.categoryService.addCategory(newCategoryData).subscribe(
      response => {
        this.toastr.success('Category added successfully');
        this.categoryForm.reset();
        this.loadCategories();
        this.hideDialog();
        this.getAllCatogary();
      },
      error => {
        this.toastr.error('Error adding category');
      }
    );
  }

  updateCategory(categoryId: number, updatedData: any): void {
    this.categoryService.updateCategory(categoryId, updatedData).subscribe(
      response => {
        // console.log("asdfa",response);
        
        this.toastr.success('Category updated successfully');
        this.categoryForm.reset();
        this.base64textString = null; // Clear base64textString after update
        this.imagePreviewUrl = null; // Clear imagePreviewUrl after update
        this.hideDialog();
        this.getAllCatogary();
        
      },
      error => {
        this.toastr.error('Error updating category');
      }
    );
  }


  getAllCatogary(){
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res.data;
    }) 
  }
  

  loadCategories(): void {
    if (this.authService.isLoggedIn()) {
      this.route.data.subscribe(
        (data: any) => {
          if (data && data.category && data.category.data) {
            this.categories = data.category.data;
          } else {
            console.error('Unexpected data format:', data);
          }
        },
        error => {
          console.error('Error fetching categories:', error);
        }
      );
    } else {
      console.error('User not logged in.');
    }
  }
  markAllAsTouched(): void {
    Object.values(this.categoryForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  updateCategoryStatus(categoryId: number, status: boolean): void {
    const newStatus = status ? 1 : 0;
    this.categoryService.updateCategoryStatus(categoryId, newStatus).subscribe(
      response => {
        const message = newStatus === 1 ? 'You have made the status Active' : 'You have made the status Inactive';
        this.toastr.success(message, 'Status Changed Successfully');

        const category = this.categories.find(cat => cat.id === categoryId);
        if (category) {
          category.status = newStatus;
        }
      },
      error => {
        console.log('Error updating category status:', error);
      }
    );
  }

  onToggleChange(categoryId: number, status: boolean): void {
    this.updateCategoryStatus(categoryId, status);
  }

  deleteCategory(categoryId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this category!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(categoryId).subscribe(
          response => {
            this.loadCategories();
            Swal.fire('Deleted!', 'The category has been deleted.', 'success');
          },
          error => {
            console.log('Error deleting category:', error);
            Swal.fire('Error', 'Error deleting category', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The category is safe :)', 'info');
      }
    });
  }
}





