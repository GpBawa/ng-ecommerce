import { Component, computed, inject, input } from '@angular/core';
import { Product } from '../../models/product';
import { MatAnchor, MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { EcommerceStore } from '../../ecommerce-store';

@Component({
  selector: 'app-product-card',
  imports: [MatAnchor, MatButton, MatIcon],
  template: `
    <div class="relative bg-white cursor-pointer rounded-x1 shadow-lg overflow-hidden flex flex-col h-full">
      <img [src]="product().imageUrl" [alt]="product().name" class="w-full h-[300px] object-cover rounded-t-xl" />
      
      <ng-content/>

      <h3 class="text-lg font-semibold text-gray-900 mb-2 leading-tight">
        {{product().name}}
      </h3>
      <p class="text-sm text-gray-600 mb-4 flex-1 leading-tight">
        {{product().description}}
      </p>

      <!-- Add rating component here-->

      <div class="text-sm font-medium mb-4">
        {{product().inStock?"In Stock":"Out of Stock"}}
      </div>
      <div class="flex items-center justify-between mt-auto">
        <span class="text-2xl font-bold text-gray-900">\${{product().price}}</span>
        <button matButton="filled" class="flex item-center gap-2" (click)="store.addToCart(product())">
          <mat-icon>shopping_cart</mat-icon>
          Add to Cart
        </button>
      </div>
    
  `,
  styles: ``,
})
export class ProductCard {
  product = input.required<Product>();
  store = inject(EcommerceStore)
}
