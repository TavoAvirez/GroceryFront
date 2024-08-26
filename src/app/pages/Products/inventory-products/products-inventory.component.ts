import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { mergeMap, map, forkJoin, Observable } from 'rxjs';
import { Product } from '../../../models/Product';
import { ProductsService } from '../../../services/products.service';
import { COMMON_IMPORTS } from '../../../app.config';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import * as common  from '../../../utils/common-helper';

@Component({
  selector: 'app-inventory-products',
  standalone: true,
  imports: [...COMMON_IMPORTS, FormsModule],
  templateUrl: './products-inventory.component.html',
})
export class ProductsInventoryComponent implements OnInit {

  products: Product[] = [];
  productForm!: FormGroup;
  previousProduct: Product | null = null;
  isEditing = false;
  @ViewChild('fileInput') fileInput!: ElementRef;


  constructor(
    private productsService: ProductsService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private productService: ProductsService,
    private formBuilder: FormBuilder,
  ) {
    this.productForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      price: ['', Validators.required],
      image: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    this.getProducts();
  }

  navigateToProductManagement(id: number) {
    this.router.navigate(['/products-management', id]);
  }


  getProducts(): void {
    this.productsService.getProducts()
      .pipe(
        mergeMap((data: Product[]) => {
          const observables = data.map(product => {
            return this.loadImage(product).pipe(
              map(() => product)
            );
          });
          return forkJoin(observables);
        })
      )
      .subscribe((data: Product[]) => {
        if (data) {
          console.log(data);
          this.products = data;
        }
      });
  }


  loadImage(product: Product): Observable<void> {
    return new Observable<void>(observer => {
      if (product.image) {
        product.imageURL = this.sanitizer.bypassSecurityTrustUrl(`data:image/jpg;base64,${product.image}`);
        observer.next();
        observer.complete();
      } else {
        observer.next();
        observer.complete();
      }
    });
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(
        (response) => {
          if (response) {
            alert('Product deleted successfully!');
            this.getProducts();
          }
        },
        error => {
          console.error('Error deleting product', error);
        }
      );
    }
  }

  edit(product: Product) {
    product.isEditing = true;
    this.previousProduct = { ...product };
  }

  cancel(product: Product) {
    if (this.previousProduct) {
      const originalProduct = this.products.find(p => p.id === product.id);
      if (originalProduct) {
        Object.assign(product, { ...this.previousProduct });
        originalProduct.isEditing = false;
      }
    }
  }

  saveChanges(product: Product) {
    const formData = new FormData();
    const formValue = product;
    const randomId = Math.floor(Math.random() * 1000000);

    formData.append('id', product.id.toString() || randomId.toString());
    formData.append('name', product.name);
    formData.append('price', product.price.toString());
    formData.append('image', product.image);


    const base64Image = formValue.image;
    if (base64Image) {
      const imageBlob = common.base64ToBlob(base64Image, 'image/jpeg'); // Cambia 'image/jpeg' al tipo MIME correcto si es necesario
      formData.set('image', imageBlob, 'image.jpg'); // Cambia 'image.jpg' al nombre de archivo correcto si es necesario
    }

    this.productService.updateProduct(product.id, formData).subscribe((response) => {
      if (response) {
        this.products.find(p => p.id === product.id)!.isEditing = false;
      } else {
        alert('An error has occurred!');
      }
    });
  }

  // Método que dispara el click del input file
  onImageClick(): void {
    this.fileInput.nativeElement.click();
  }

  // Método que maneja el cambio del input file
  onFileSelected(event: Event, product: Product): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        product.imageURL = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

}
