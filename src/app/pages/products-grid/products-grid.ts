import { Component, computed, input, signal } from '@angular/core';
import { Product } from '../../models/product';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ProductCard } from '../../components/product-card/product-card';
import { MatSidenav, MatSidenavContent, MatSidenavContainer } from '@angular/material/sidenav';
import { MatNavList, MatListItem, MatListItemTitle } from '@angular/material/list';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-grid',
  imports: [ProductCard, 
    MatSidenav, 
    MatSidenavContent, 
    MatSidenavContainer, 
    MatNavList, 
    MatListItem, 
    MatListItemTitle, 
    RouterLink,
    TitleCasePipe
  ],
  template: `
   <mat-sidenav-container>
    <mat-sidenav mode="side" opened="true">
      <div class="p-6">
        <h2 class="text-lg text-gray-900">Categories</h2>
        <mat-nav-list>
          @for (cat of categories(); track cat) {
            <mat-list-item [activated]="cat === category()" class="my-2" [routerLink]="['/products', cat]">
              <span matListItemTitle class="font-medium" [class]="cat === category()?'!text-white':null">
                {{cat|titlecase}}
              </span>
            </mat-list-item>
          }
        </mat-nav-list>
      </div>
    </mat-sidenav>
    <mat-sidenav-content class="bg-gray-100 p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">{{category()|titlecase}}</h1>
      <p class="text-base text-gray-900 mb-6">{{filteredProducts().length}} products found</p>
      <div class="responsive-grid">
        @for(product of filteredProducts(); track product.id) {
          <app-product-card [product]="product"></app-product-card>
        }
      </div>
    </mat-sidenav-content>
   </mat-sidenav-container>

  `,
  styles: ``,
})
export default class ProductsGrid {
  category = input<string>('all');
  products = signal<Product[]>([
    { id: 'p1', name: 'Classic Tee', description: '100% cotton unisex t-shirt', price: 19.99, imageUrl: 'assets/products/Product_01.jpg', rating: 4.5, reviewCount: 120, inStock: true, category: 'apparel' },
    { id: 'p2', name: 'Running Sneakers', description: 'Lightweight running shoes', price: 79.99, imageUrl: 'assets/products/Product_02.jpg', rating: 4.7, reviewCount: 89, inStock: false, category: 'footwear' },
    { id: 'p3', name: 'Bluetooth Headphones', description: 'Noise-cancelling over-ear headphones', price: 129.99, imageUrl: 'assets/products/Product_03.jpg', rating: 4.3, reviewCount: 42, inStock: true, category: 'electronics' },
    { id: 'p4', name: 'Denim Jacket', description: 'Classic blue denim jacket', price: 59.99, imageUrl: 'assets/products/Product_04.jpg', rating: 4.2, reviewCount: 34, inStock: true, category: 'apparel' },
    { id: 'p5', name: 'Stainless Kettle', description: '1.7L electric kettle', price: 39.99, imageUrl: 'assets/products/Product_05.jpg', rating: 4.1, reviewCount: 18, inStock: true, category: 'kitchen' },
    { id: 'p6', name: 'Yoga Mat', description: 'Non-slip fitness mat', price: 25.00, imageUrl: 'assets/products/Product_06.jpg', rating: 4.6, reviewCount: 76, inStock: true, category: 'sports' },
    { id: 'p7', name: 'Smart Watch', description: 'Heart-rate and activity tracking', price: 199.99, imageUrl: 'assets/products/Product_07.jpg', rating: 4.4, reviewCount: 210, inStock: false, category: 'electronics' },
    { id: 'p8', name: 'Leather Wallet', description: 'Slim bifold wallet', price: 29.99, imageUrl: 'assets/products/Product_08.jpg', rating: 4.0, reviewCount: 12, inStock: true, category: 'accessories' },
    { id: 'p9', name: 'Coffee Grinder', description: 'Manual burr grinder', price: 45.00, imageUrl: 'assets/products/Product_09.jpg', rating: 4.5, reviewCount: 53, inStock: true, category: 'kitchen' },
    { id: 'p10', name: 'Sunglasses', description: 'Polarized UV protection', price: 49.99, imageUrl: 'assets/products/Product_10.jpg', rating: 4.3, reviewCount: 98, inStock: true, category: 'accessories' },
    { id: 'p11', name: 'Backpack', description: 'Water-resistant travel backpack', price: 69.99, imageUrl: 'assets/products/Product_11.jpg', rating: 4.6, reviewCount: 159, inStock: true, category: 'bags' },
    { id: 'p12', name: 'Desk Lamp', description: 'LED adjustable desk lamp', price: 22.50, imageUrl: 'assets/products/Product_12.jpg', rating: 4.2, reviewCount: 27, inStock: true, category: 'home' },
  ]);
  filteredProducts = computed(() => this.products()
    .filter(p => p.category === this.category().toLowerCase() || this.category() === 'all'));

  categories = signal<string[]>(['all', 'electronics', 'clothing', 'accessories', 'home']);
}
