import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { RecentProductsComponent } from './components/recent-products/recent-products.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ProductFormComponent,
    ProductListComponent,
    RecentProductsComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
