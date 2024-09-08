import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { mergeMap, map, forkJoin, Observable } from 'rxjs';
import { Product } from '../../../models/Product';
import { ProductsService } from '../../../services/products.service';
import { COMMON_IMPORTS } from '../../../app.config';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import * as common from '../../../utils/common-helper';
import { LoadingComponent } from '../../loading/loading.component';

@Component({
  selector: 'app-inventory-products',
  standalone: true,
  imports: [...COMMON_IMPORTS, LoadingComponent],
  templateUrl: './products-inventory.component.html',
})
export class ProductsInventoryComponent implements OnInit {

  products: Product[] = [];
  productForm!: FormGroup;
  previousProduct: Product | null = null;
  showLoader = true;
  isEditing = false;
  @ViewChild('fileInput') fileInput!: ElementRef;


  constructor(
    private productsService: ProductsService,
    private sanitizer: DomSanitizer,
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

  /**
   * Método de ciclo de vida de Angular que se llama después de que Angular ha inicializado todas las propiedades de datos vinculados.
   * Aquí se llama al método getProducts para cargar los productos.
  */
  ngOnInit(): void {
    this.getProducts();
  }

  /**
   * Obtiene la lista de productos desde el servicio de productos y carga las imágenes de cada producto.
   * Los productos se almacenan en la propiedad `products` del componente.
  */
  getProducts(): void {
    this.productsService.getProducts()
      .pipe(
        mergeMap((data: Product[]) => {
          const observables = data.map(product => {
            return this.loadImage(product).pipe(              
              map(() => {                
                return product;
              })
            );
          });
          return forkJoin(observables);
        })
      )
      .subscribe(
        {
          next: (data: Product[]) => {
            if (data) {
              this.showLoader = false;
              console.log('Product loaded', this.showLoader);
              this.products = data;
            }
          },
          error: (error) => {
            alert('Error loading products');
            console.error('Error loading products', error);
          },
          complete: () => {
            console.log('Product loading completed');
          }
        }
    );
  }

  /**
   * Carga la imagen de un producto y la convierte en una URL segura.
   * @param product - El producto cuya imagen se va a cargar.
   * @returns Un Observable que se completa cuando la imagen se ha cargado.
   */
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

  /**
   * Elimina un producto dado su ID después de confirmar la acción con el usuario.
   * Si la eliminación es exitosa, muestra una alerta de éxito y actualiza la lista de productos.
   * Si ocurre un error durante la eliminación, lo registra en la consola.
   * @param id - El ID del producto que se desea eliminar.
   */
  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(
        () => {
          alert('Product deleted successfully!');
          this.getProducts();
        },
        error => {
          console.error('Error deleting product', error);
        }
      );
    }
  }

  /*
    * Activa el modo de edición para un producto y guarda una copia del estado
    * Esto permite que el usuario edite el producto y, si es necesario, revertir los cambios.
    * @param product - El producto que se va a editar.
  */
  edit(product: Product) {
    product.isEditing = true;
    this.previousProduct = { ...product };
  }

  /**
   * Cancela la edición de un producto y restaura sus valores originales.
   * Si hay un producto previo almacenado, encuentra el producto original en la lista de productos
   * y restaura sus valores a los del producto previo. Luego, desactiva el modo de edición.
   * @param product - El producto que se está editando y se desea cancelar la edición.
   */
  cancel(product: Product) {
    if (this.previousProduct) {
      const originalProduct = this.products.find(p => p.id === product.id);
      if (originalProduct) {
        Object.assign(product, { ...this.previousProduct });
        originalProduct.isEditing = false;
      }
    }
  }

  /**
   * Guarda los cambios realizados en un producto.
   * Crea un objeto FormData con los datos del producto, incluyendo la conversión de la imagen base64 a un Blob.
   * Luego, llama al servicio de productos para actualizar el producto en el servidor.
   * Si la actualización es exitosa, desactiva el modo de edición del producto.
   * Si ocurre un error, muestra una alerta al usuario.
   * @param product - El producto con los cambios que se desean guardar.
  */
  saveChanges(product: Product) {
    const formData = new FormData();
    const formValue = product;
    const randomId = Math.floor(Math.random() * 1000000);

    formData.append('id', product.id.toString() || randomId.toString());
    formData.append('quantity', product.quantity.toString());
    formData.append('name', product.name);
    formData.append('price', product.price.toString());
    formData.append('image', product.image);

    let base64Image = formValue.image;
    base64Image = base64Image.split(',');
    if (base64Image && base64Image.length > 1) {
      base64Image = base64Image[1];
      const imageBlob = common.base64ToBlob(base64Image, 'image/jpeg'); // Cambia 'image/jpeg' al tipo MIME correcto si es necesario
      formData.set('image', imageBlob, 'image.jpg'); // Cambia 'image.jpg' al nombre de archivo correcto si es necesario
    }

    this.productService.updateProduct(product.id, formData).subscribe(
      () => {
        this.products.find(p => p.id === product.id)!.isEditing = false;        
      }, error => {
        console.error('Error updating product', error);
      }
    );
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
        product.image = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

}
