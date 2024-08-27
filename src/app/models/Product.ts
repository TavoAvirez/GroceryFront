import { SafeUrl } from "@angular/platform-browser";

export interface Product {
    id: number;
    quantity: number;
    name: string;
    price: number;
    image: any;
    imageURL: SafeUrl;
    isEditing: boolean;
}
