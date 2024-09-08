import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = 'http://localhost:5262/';
  private url = 'api/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl + this.url);
  }

  getProduct(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl + this.url}/${id}`);
  }

  getProductByQuery(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl + this.url}/search/?query=${query}`).pipe(
      catchError(error => {
        return of([]);
      })
    );
  }


  createProduct(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + this.url, product);
  }

  updateProduct(id: number, product: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl + this.url}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl + this.url}/${id}`);
  }
}