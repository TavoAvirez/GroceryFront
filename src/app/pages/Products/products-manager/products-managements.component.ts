import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../../../services/products.service';
import { COMMON_IMPORTS } from '../../../app.config';
import { Product } from '../../../models/Product';
import { ActivatedRoute, Router } from '@angular/router';
import * as common from '../../../utils/common-helper';


@Component({
  selector: 'app-products-manager',
  standalone: true,
  imports: [...COMMON_IMPORTS, ReactiveFormsModule],
  templateUrl: './products-managements.component.html',

})

export class ProductsManagementsComponent implements OnInit {

  productForm!: FormGroup;
  isEditing = false;
  /**
   * Constructor del componente de gestión de productos.
   * Inicializa el formulario del producto con validaciones requeridas para los campos.
   * Suscribe a los parámetros de la ruta para verificar si hay un ID de producto presente.
   * Si hay un ID de producto, establece el modo de edición y carga los datos del producto.
   *
   * @param formBuilder - Servicio para construir formularios reactivos.
   * @param productService - Servicio para interactuar con la API de productos.
   * @param route - Servicio para acceder a los parámetros de la ruta activa.
   * @param router - Servicio para la navegación del router.
 */
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


  /**
   * Maneja el evento de cambio de archivo, leyendo el archivo seleccionado y actualizando el formulario del producto
   * con la cadena base64 de la imagen si es válida.
   * 
   * @param event - El evento de cambio de archivo que contiene el archivo seleccionado.
   */
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1]; // Guardar solo la parte base64
        if (base64String) {
          this.productForm.patchValue({
            image: base64String
          });
        } else {
          alert('The selected file is not a valid base64 encoded string.');
        }
      };
    }
  }

  /**
   * Guarda un nuevo producto.
   * Verifica si el formulario del producto es válido. Si no lo es, muestra una alerta al usuario.
   * Crea un objeto FormData con los datos del producto, incluyendo un ID aleatorio.
   * Luego, llama al servicio de productos para crear el producto en el servidor.
   * Si la creación es exitosa, muestra una alerta al usuario y reinicia el formulario.
  */
  save() {
    if (this.productForm.invalid) {
      alert('Please fill all the fields!');
      return;
    }

    const formData = new FormData();
    const randomId = Math.floor(Math.random() * 1000000);

    formData.append('id', randomId.toString());
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('price', this.productForm.get('price')?.value);
    formData.append('image', (this.productForm.get('image')?.value));

    this.productService.createProduct(formData).subscribe((response) => {
      if (response) {
        alert('Product saved successfully!');
        this.productForm.reset();
      }
    });
  }

  /**
   * Carga un producto por su ID.
   * Llama al servicio de productos para obtener los datos del producto especificado por el ID.
   * Si la solicitud es exitosa, actualiza el formulario del producto con los datos recibidos.
   * Si ocurre un error durante la carga del producto, lo registra en la consola.
   *
   * @param id - El ID del producto a cargar.
 */
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
