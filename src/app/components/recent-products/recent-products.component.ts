import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { CommonModule, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-recent-products',
  templateUrl: './recent-products.component.html',
  styleUrls: ['./recent-products.component.css'],
  standalone: true,
  imports: [CommonModule, AsyncPipe]
})
export class RecentProductsComponent {
  recentProducts$: Observable<Product[]>;

  constructor(public productService: ProductService) {
    this.recentProducts$ = this.productService.recentProducts$.pipe(
      map(products => [...products]
        .sort((a, b) => (b.CreatedAt || 0) - (a.CreatedAt || 0))
        .slice(0, 5)
      )
    );
  }
}
