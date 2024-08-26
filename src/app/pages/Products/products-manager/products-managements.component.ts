import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../../../services/products.service';
import { COMMON_IMPORTS } from '../../../app.config';
import { Product } from '../../../models/Product';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-products-manager',
  standalone: true,
  imports: [...COMMON_IMPORTS, ReactiveFormsModule],
  templateUrl: './products-managements.component.html',

})

export class ProductsManagementsComponent implements OnInit {

  productForm!: FormGroup;
  isEditing = false;
  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      price: ['', Validators.required],
      image: ['', Validators.required],
    });

    this.route.params.subscribe(params => {
      const productId = +params['id']; // El signo + convierte el string a número
      if (productId) {
        this.isEditing = true;
        this.loadProduct(productId);
      }
    });
  }

  ngOnInit(): void {

  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1]; // Guardar solo la parte base64
        if (base64String && this.isBase64(base64String)) {
          this.productForm.patchValue({
            image: base64String
          });
        } else {
          alert('The selected file is not a valid base64 encoded string.');
        }
      };
    }
  }
  
  private base64ToBlob(base64: string, contentType: string = '', sliceSize: number = 512): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  private isBase64(str: string): boolean {
    if (str === '' || str.trim() === '') {
      return false;
    }
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }


  save() {
    if (this.productForm.invalid) {
      alert('Please fill all the fields!');
      return;
    }
    
    const formData = new FormData();
    const formValue = this.productForm.value;
    const randomId = Math.floor(Math.random() * 1000000);

    formData.append('id', this.productForm.get('id')?.value || randomId.toString());
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('price', this.productForm.get('price')?.value);
    formData.append('image', (this.productForm.get('image')?.value));


    const base64Image = formValue.image;
    if (base64Image) {
      const imageBlob = this.base64ToBlob(base64Image, 'image/jpeg'); // Cambia 'image/jpeg' al tipo MIME correcto si es necesario
      formData.set('image', imageBlob, 'image.jpg'); // Cambia 'image.jpg' al nombre de archivo correcto si es necesario
    }
    if (this.isEditing) {
      this.productService.updateProduct(this.productForm.get('id')?.value, formData).subscribe((response) => {
        if (response) {
          alert('Product updated successfully!');
          this.productForm.reset();
          this.router.navigate(['/products-inventory']);
        }
      });
      
    } else {
      this.productService.createProduct(formData).subscribe((response) => {
        if (response) {
          alert('Product saved successfully!');
          this.productForm.reset();
        }
      });
    }
  }

  loadProduct(id: number) {
    this.productService.getProduct(id).subscribe(
      (product: Product) => {
        this.productForm.patchValue({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image
        });
      },
      error => {
        console.error('Error loading product', error);
      }
    );
  }  
}
