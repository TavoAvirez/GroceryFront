import { SafeUrl } from "@angular/platform-browser";

export interface Product {
    id: number;
    name: string;
    price: number;
    image: any;
    imageURL: SafeUrl;
    isEditing: boolean;
}
