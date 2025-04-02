import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class ProductFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(1)]],
      codigo: ['', Validators.required],
      descuento: [false]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.productService.addProduct(this.form.value).subscribe({
        next: (response) => {
          console.log('Producto agregado:', response);
          alert('Producto agregado con éxito');
          this.form.reset({precio: 0, descuento: false});
        },
        error: (error) => {
          console.error('Error al agregar producto:', error);
          alert('Error al agregar producto');
        }
      });
    }
  }
}
