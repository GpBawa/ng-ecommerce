import { Component, inject, signal } from '@angular/core';
import { ViewPanel } from "../../../directives/view-panel";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OptionItems } from '../../../models/option-item';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatSelect, MatOption } from '@angular/material/select';
import { EcommerceStore } from '../../../ecommerce-store';
import { AddReviewParams } from '../../../models/user-review';

@Component({
  selector: 'app-write-review',
  imports: [ViewPanel, ReactiveFormsModule, MatFormField, MatInput, MatSelect, MatOption, MatButton, MatLabel],
  template: `
    <div appViewPanel>
      <h2 class="text-xl font-semibold mb-6">Write a Review</h2>
      <form [formGroup]="reviewForm" ngSubmit="saveReview()">
        <div class="grid grid-cols-1 lg:grid-cols-2 mb-4">
          <mat-form-field>
            <mat-label>Review Title</mat-label>
            <input matInput formControlName="title" type="text" placeholder="Summarize your review"/>
          </mat-form-field>
          <mat-form-field>
            <mat-select formControlName="rating">
              @for (option of ratingOptions(); track option.value) {
                <mat-option [value]="option.value">{{option.label}}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field class="col-span-2">
            <mat-label>Review</mat-label>
            <textarea matInput formControlName="comment" type="text" placeholder="Tell other about your experience with this product" rows="4">
            </textarea>
          </mat-form-field>
        </div>
        <div class="flex gap-4">
          <button matButton="filled" type="submit" [disabled]="store.loading()" (click)="saveReview()">
            {{store.loading() ? 'Submitting...' : 'Submit Review'}}
          </button>
          <button matButton="outlined" type="button" (click)="store.hideWriteReview()">
            Cancel
          </button>
        </div>
      </form>

    </div>
  `,
  styles: ``,
})
export class WriteReview {
  fb = inject(NonNullableFormBuilder);
  ratingOptions = signal<OptionItems[]> ([
    {label:'5 Stars - Excellent', value:5},
    {label:'4 Stars - Good', value:4},
    {label:'3 Stars - Average', value:3},
    {label:'2 Stars - Poor', value:2},
    {label:'1 Star - Terrible', value:1},
  ]);
  reviewForm = this.fb.group({
    title: ['', Validators.required],
    comment: ['', Validators.required],
    rating: [0, Validators.required],
  });

  store = inject(EcommerceStore);
  saveReview() {
    if(!this.reviewForm.valid) { 
      this.reviewForm.markAllAsTouched
      return; 
    }
    const {title, comment, rating} = this.reviewForm.value;
    this.store.addReview({title, comment, rating} as AddReviewParams);
  }

}
