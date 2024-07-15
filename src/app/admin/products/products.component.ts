import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductserviceService } from './productservice.service';
import { Product,ProductListResponse,ChangeStatusResponse, editProductResponse, AddProduct,Catrgories } from './product.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth-service.service';
import { Category ,CategoryResponse} from '../category/category.model';
import Swal from 'sweetalert2';
import { SelectItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  selectedProducts: any[] = [];
  product!: Product;
  categories: Category[] = [];
  isEditMode: boolean = false;
  loading: boolean = true;
  selectedCategoryId!: any;
  productForm!: FormGroup;
  temp: any;
  isStatusChecked!: boolean;
  visible: boolean = false;
  uploadedImageUrl!: string;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  categoriesnew!: SelectItem[]
  base64textString: string | null = null;
  constructor( public route: ActivatedRoute,public dialogService: DialogService ,private fb: FormBuilder, private productService: ProductserviceService,private toastr: ToastrService,private authService: AuthService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      // price: ['', Validators.required],
      // qty: ['', Validators.required],
      image: [''],
      // sku: [''],
      category_id: ['', Validators.required],  // Hardcoded for now, adjust as necessary
      slug: [''] 
    });
  }
loadCategories(): void {
  this.productService.getAllCategories().subscribe(
    (response: CategoryResponse) => {
      console.log("category",response);
      this.categoriesnew = response.data.map(category => ({
          label: category.name,
          value: category.id
      }));
    },
    error => {
      console.error('Error fetching categories:', error);
    }
  );
}
onFileChange(event: any): void {
  const files = event.target.files;
  const file = files[0];

  if (files && file) {
    const reader = new FileReader();

    reader.onload = () => {
      this.base64textString = reader.result as string;
      this.productForm.patchValue({ image: this.base64textString });
      this.uploadedImageUrl = reader.result as string;
      this.imagePreviewUrl = reader.result as string; // Update image preview URL with uploaded image

      // Clear the input field value after successfully loading the image
      const fileInput = event.target as HTMLInputElement;
      fileInput.value = ''; // Reset the input field value
    };

    reader.readAsDataURL(file);
  } else {
    // Clear the image preview and image name if no file is selected
    this.base64textString = null; // Reset base64textString
    this.imagePreviewUrl = null;
    this.uploadedImageUrl = '';

    // Clear the input field value if no file is selected
    const fileInput = event.target as HTMLInputElement;
    fileInput.value = ''; // Reset the input field value
  }
}



getPreviewImage(): string | ArrayBuffer | null {
  if (!this.base64textString && this.imagePreviewUrl) {
    return this.imagePreviewUrl; // Display old image if not updating
  } else if (this.imagePreviewUrl && this.base64textString) {
    return this.base64textString; // Display new image if updating
  }
  return null;
}
setEditMode(isEdit: boolean) {
  this.isEditMode = isEdit;
}
openEditDialog(productId: number): void {
  this.setEditMode(true);
  this.productForm.reset();
  this.productService.getProductById(productId).subscribe(
    (response: any) => {
      console.log(response.data);
      this.product = response.data; // Set the product object
      this.productForm.patchValue({
        name: response.data.name,
        description: response.data.description,
        // price: response.data.price,
        // qty: response.data.qty,
        category_id: response.data.category_id,
        slug: response.data.slug,
        // Do not patch the image value here
      });
      this.selectedCategoryId = response.data.category_id;
      this.temp = this.categoriesnew.find(e => e.value == this.selectedCategoryId);
      this.uploadedImageUrl = response.data.image;
      this.imagePreviewUrl =response.data.image; // Display old image if available
      // Explicitly check if productForm and image control are not null before accessing value
      const imageControl = this.productForm.get('image');
      if (imageControl !== null && imageControl.value) {
        // If a new image is selected, update the uploadedImageUrl
        this.uploadedImageUrl = imageControl.value;
      } else {
        // If no new image is selected, set uploadedImageUrl to the existing image URL
        this.uploadedImageUrl = response.data.image;
      }
      this.visible = true;
    },
    error => {
      console.error('Error fetching product details:', error);
    }
  );
}
onSubmit(): void {
  if (this.productForm.valid) {
    const productValue: Product = this.productForm.value;
    // Convert the image to base64 if necessary
    if (this.base64textString && this.productForm.value.image != null) {
      productValue.image = this.base64textString!; // Set the base64 string to the image property
    }
    else {
      this.productForm.value['image'] = null;
    }
    if (this.isEditMode && this.product) {
      productValue.category_id = this.temp.value;
      const productId = this.product.id;
      this.productService.updateProduct(productId, productValue).subscribe(
        response => {
          console.log('Product updated successfully', response);
          // this.productForm.reset();
          this.toastr.success('Product updated successfully', 'Success');
          this.visible = false;
          this.productForm.reset(); // Reload products after updating
          this.getAllProduct();
          // this.loadProducts();
         
        },
        error => {
          console.error('Error updating product', error);
          this.toastr.error('Error updating product', 'Error');
        }
      );
    } else {
      // Add new product
      let obj: AddProduct = {
        name: productValue.name,
        // price: productValue.price,
        description: productValue.description,
        image: productValue.image!,
        slug: productValue.slug,
        category_id: this.temp.value + ''
      };

      this.productService.addProduct(obj).subscribe(
        response => {
          console.log('Product added successfully', response);
          this.toastr.success('Product added successfully', 'Success');
          this.visible = false;
          this.productForm.reset();
          this.uploadedImageUrl = '';
          this.getAllProduct();
         
          // this.loadProducts(); // Reload products after adding
        },
        error => {
          console.error('Error adding product', error);
          this.toastr.error('Error adding product', 'Error');
        }
      );
    }
  } else {
    // If form is invalid or base64 string is missing, mark all fields as touched to display validation messages
    this.productForm.markAllAsTouched();
  }
}
deleteProduct(productId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(productId).subscribe(
          response => {
            console.log('Product deleted successfully:', response);
            this.getAllProduct();
            Swal.fire('Deleted!', 'The Product has been deleted.', 'success');
          },
          error => {
            console.error('Error deleting Product:', error);
            // Handle error, such as displaying an error message
            Swal.fire('Error!', 'Failed to delete the Product.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The Product is safe :)', 'info');
      }
    });
  }
  // Assuming Product interface has been defined
  changeProductStatus(productId: number, checked: boolean): void {
    const newStatus = checked ? 1 : 0;
    this.productService.changeProductStatus(productId, newStatus).subscribe(
        (response: ChangeStatusResponse) => {
          const message = newStatus === 1 ? 'You have made the status Active' : 'You have made the status Inactive';
            console.log('Product status changed successfully:', response);
            this.toastr.success(message,'Category updated successfully');
            // Handle success, such as refreshing the list of products
        },
        error => {
            console.error('Error changing product status:', error);
            // Handle error, such as displaying an error message
        }
    );
}


getAllProduct(): void {
  this.productService.getAllproduct().subscribe(
    (res: any) => {
      this.products = res.data.map((product: any) => {
        if (product.category_name == null) {
          product.category_name = 'Unknown';
        }
        return product;
      });
    },
    error => {
      console.error('Error fetching products:', error);
    }
  );
}

 loadProducts(): void {
    // debugger;
    this.route.data.subscribe(
      (response : any) => {
        console.log('API Response:', response);
        // response.category_id = this.loadCategories.name;
      
        this.products = response.products.data.map((product: any) => {
          if (product.category_name == null) {
            product.category_name = 'Unknown';
          }
          return product;
        });
        this.products = response.products.data;
        console.log(this.products);
        this.loading = false;
        console.log(response);
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }
  deleteSelectedProducts(): void {
    if (this.selectedProducts.length === 0) {
      Swal.fire('No Selection', 'Please select at least one service to delete.', 'info');
      return;
    }

    const productIds = this.selectedProducts.map(product => product.id);

    Swal.fire({
      title: 'Are You Sure?',
      text: 'You will not be able to recover these Services!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete them!',
      cancelButtonText: 'No, keep them'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProducts(productIds).subscribe(
          response => {
            this.products = this.products.filter(product => !productIds.includes(product.id));
            this.selectedProducts = [];
            Swal.fire('Deleted!', 'The selected services have been deleted.', 'success');
          },
          error => {
            console.error('Error deleting companies:', error);
            Swal.fire('Error!', 'Failed to delete the selected services.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The selected services are safe :)', 'info');
      }
    });
  }
  getCategoryNameById(category_id: number): string {
    const category = this.categoriesnew.find((cat: any) => cat.value === Number(category_id));
    console.log(category);
    return category ? category.label! : 'Unknown';
  }
  ngOnInit(): void {
   
    this.loadCategories();
    this.loadProducts();
  }
  showDialog() {    
    this.productForm.reset();
    this.visible = true;
    this.imagePreviewUrl = null;  // Clear image preview URL
    this.uploadedImageUrl = '';   // Clear uploaded image URL
    this.base64textString = null; // Reset base64 string if needed
    this.productForm.get('category_id')!.setValue('0'); // Assuming '0' is the default category ID or initial state
    this.isEditMode = false;
  }
  
}
