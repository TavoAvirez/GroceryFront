import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../services/products.service';
import { Product } from '../../../models/Product';
import { forkJoin, map, mergeMap, Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { COMMON_IMPORTS } from '../../../app.config';

@Component({
  selector: 'app-pos',
  standalone: true,
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss',
  imports: [...COMMON_IMPORTS]
  
})
export class PosComponent implements OnInit {

  products: Product[] = [];
  cart: Product[] = [];
  
  
  constructor(
    private productsService: ProductsService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  // create a function to get all products from the service and store them in the products array
  getProducts() {
    this.productsService.getProducts()
      .pipe(
        mergeMap((data: Product[]) => {
          const observables = data.map(product => {
            return this.loadImage(product).pipe(
              map(() => {
                return {
                  ...product,
                  selectedQuantity: 0
                }
              })
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

  // create a function to add a product to the cart
  addToCart(product: Product) {
    // check if the product is already in the cart
    const index = this.cart.findIndex(p => p.id === product.id);
    if (index !== -1) {
      // if the product is already in the cart, increment the selectedQuantity
      this.cart[index].selectedQuantity++;
      return;
    }
    this.cart.push(product);
  }

  /**
 * Incrementa la cantidad seleccionada de un producto en el carrito de compras.
 * 
 * @param {Product} product - El producto cuya cantidad seleccionada se va a incrementar.
 * 
 * Función del Método:
 * - Incrementa la cantidad seleccionada del producto.
 */  
  incrementQuantity(product: Product) {
    product.selectedQuantity++;
  }

  /**
 * Decrementa la cantidad seleccionada de un producto en el carrito de compras.
 * 
 * @param {Product} product - El producto cuya cantidad seleccionada se va a decrementar.
 * 
 * Función del Método:
 * - Decrementa la cantidad seleccionada del producto si es mayor que 0.
 * - Elimina el producto del carrito si la cantidad seleccionada llega a 0.
 */
  decrementQuantity(product: Product) {
    if (product.selectedQuantity > 0) {
      product.selectedQuantity--;
    }
    if (product.selectedQuantity === 0 && this.isProductInCart(product)) {
      this.cart = this.cart.filter(cartItem => cartItem.id !== product.id);
    }
  }

  // Método para verificar si el producto está en el carrito
  isProductInCart(product: Product): boolean {
    return this.cart.some(cartItem => cartItem.id === product.id);
  }


}
