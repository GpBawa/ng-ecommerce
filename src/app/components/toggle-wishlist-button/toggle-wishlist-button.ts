import { Component, computed, inject, input } from '@angular/core';
import { EcommerceStore } from '../../ecommerce-store';
import { Product } from '../../models/product';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-toggle-wishlist-button',
  imports: [MatIcon, MatIconButton],
  template: `
    <button matIconButton (click)="toggleWishList(product())"
    class="w-10 h-10 rounded-full !bg-white border-0 shadow-md flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg"
    [class]="isInWishList()? '!text-red-500':'!text-gray-400'">
      <mat-icon>{{isInWishList()? 'favorite': 'favorite-filled'}}</mat-icon>
    </button>
  `,
  styles: ``,
})
export class ToggleWishlistButton {
  product = input.required<Product>();
  store = inject(EcommerceStore);
  isInWishList = computed(()=>this.store.wishlistItems().find((p)=>p.id === this.product().id))
  toggleWishList(product:Product) {
    if(this.isInWishList()) {
      this.store.removeFromWishList(product);
    } else {
      this.store.addToWishList(product);
    }
  }

}
