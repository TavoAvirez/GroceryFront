import { SafeUrl } from "@angular/platform-browser";

export class Product {
    
    constructor() {
        this.id = 0;
        this.quantity = 0;
        this.selectedQuantity = 0;
        this.name = '';
        this.price = 0;
        this.image = null;
        this.imageURL = '' as SafeUrl; // Asignar un valor SafeUrl por defecto
        this.isEditing = false;
    }

    id: number;
    quantity: number;
    selectedQuantity: number;
    name: string;
    price: number;
    image: any;
    imageURL: SafeUrl;
    isEditing: boolean;
}
