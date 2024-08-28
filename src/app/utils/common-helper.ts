import { Observable } from "rxjs";
import { Product } from "../models/Product";
import { DomSanitizer } from "@angular/platform-browser";
import { inject } from "@angular/core";

export function base64ToBlob(base64: string, contentType: string = '', sliceSize: number = 512): Blob {
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

export function isBase64(str: string): boolean {
    if (str === '' || str.trim() === '') {
        return false;
    }
    try {
    } catch (err) {
        return btoa(atob(str)) === str;
    }
    return false;
}

