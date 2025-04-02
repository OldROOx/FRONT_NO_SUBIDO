import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer, BehaviorSubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080';
  private lastCheckTime = Math.floor(Date.now() / 1000); // Timestamp actual
  private expectedCount: number | null = null;

  private discountCountSubject = new BehaviorSubject<number>(0);
  discountCount$ = this.discountCountSubject.asObservable();

  private recentProductsSubject = new BehaviorSubject<Product[]>([]);
  recentProducts$ = this.recentProductsSubject.asObservable();

  private discountedProductsSubject = new BehaviorSubject<Product[]>([]);
  discountedProducts$ = this.discountedProductsSubject.asObservable();

  constructor(private http: HttpClient) {
    // Asegura que lastCheckTime sea el tiempo actual al recargar
    this.lastCheckTime = Math.floor(Date.now() / 1000);
    localStorage.setItem('pageLoadTime', this.lastCheckTime.toString());
    this.initPolling();
  }

  addProduct(product: any): Observable<Product> {
    console.log('Enviando producto:', product);
    const backendProduct = {
      Nombre: product.nombre,
      Precio: product.precio,
      Codigo: product.codigo,
      Descuento: product.descuento
    };

    return this.http.post<Product>(`${this.apiUrl}/addProduct`, backendProduct);
  }

  private initPolling(): void {
    // Short polling para productos recientes
    timer(0, 5000).pipe(
      switchMap(() => this.http.get<any>(`${this.apiUrl}/isNewProductAdded?since=${this.lastCheckTime}`)),
      tap(res => {
        if (res && res.now) {
          this.lastCheckTime = res.now;
          console.log('Productos recibidos:', res.products);

          if (Array.isArray(res.products)) {
            this.recentProductsSubject.next(res.products);
          }
        }
      })
    ).subscribe();

    // Long polling para contador de descuentos
    this.pollDiscountCount();
  }

  private pollDiscountCount(): void {
    let url = `${this.apiUrl}/countProductsInDiscount`;
    if (this.expectedCount !== null) {
      url += `?expectedCount=${this.expectedCount}`;
    }

    this.http.get<any>(url).subscribe({
      next: (res) => {
        console.log('Count response:', res);
        if (res && res.count !== undefined) {
          this.expectedCount = res.count;
          this.discountCountSubject.next(res.count);
          this.updateDiscountedProducts();
        }
        this.pollDiscountCount();
      },
      error: (err) => {
        console.error('Error en long polling:', err);
        setTimeout(() => this.pollDiscountCount(), 10000);
      }
    });
  }

  private updateDiscountedProducts(): void {
    this.http.get<any>(`${this.apiUrl}/isNewProductAdded?since=0`)
      .subscribe(res => {
        if (res && Array.isArray(res.products)) {
          const discounted = res.products.filter((p: Product) => p.Descuento);
          this.discountedProductsSubject.next(discounted);
        }
      });
  }
}
