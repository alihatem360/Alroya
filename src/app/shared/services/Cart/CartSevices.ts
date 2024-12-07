import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from '../Base/base.service';
import { AuthService } from '../auth/auth.service';
import { CartViewModel } from '../../models/interfaces/Cart';
import { ProductType } from '../../models/classes/ProductType';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartCount = new BehaviorSubject<number>(this.getCartCount(null));
  cartCount$ = this.cartCount.asObservable();

  private cartOpened = new BehaviorSubject<boolean>(false);
  cartOpened$ = this.cartOpened.asObservable();
  private offcanvasOpened = new BehaviorSubject<boolean>(false);
  offcanvasOpened$ = this.offcanvasOpened.asObservable();

  constructor(
    private baseService: BaseService,
    private authService: AuthService
  ) {}
  openOffcanvas(): void {
    this.offcanvasOpened.next(true);
  }

  closeOffcanvas(): void {
    this.offcanvasOpened.next(false);
  }

  toggleOffcanvas(): void {
    this.offcanvasOpened.next(!this.offcanvasOpened.value);
  }
  public getCartCount(isRemove: boolean | null): number {
    if (!this.authService.getToken()) {
      return 0;
    }

    this.baseService.getLookup<CartViewModel>('cartItems').subscribe({
      next: (result) => {
        let cartItems = result || [];
        this.cartCount.next(cartItems.length);
      },
      error: () => {
        console.error('Error loading wishlist:');
      },
    });

    if (isRemove == null) {
      return 0;
    } else if (isRemove) {
      return this.cartCount.value - 1;
    } else {
      return this.cartCount.value + 1;
    }
  }

  addToCart(
    productId: number,
    productType: ProductType,
  ): void {
    if (!this.authService.getToken()) {
      this.baseService.navigateToPage('login');
      return;
    }
    var object = null;

    if (productType === ProductType.Plan) {
      object = { planId: productId };
    } else if (productType === ProductType.kitchenProgram) {
      object = { KitchenProgramId: productId };
    } else if (productType === ProductType.clinicProgram) {
      object = { ClinicProgramId: productId };
    } else {
      object = { testId: productId };
    }
    this.baseService.create('CartItems', object).subscribe({
      next: () => {
        this.cartOpened.next(true);
        this.cartCount.next(this.getCartCount(false));
      },
      error: (error) => {
        this.cartOpened.next(true);
        console.error('Error loading wishlist:', error);
      },
    });
  }

  removeFromCart(carttId: number): void {
    this.baseService.delete('CartItems/' + carttId).subscribe({
      next: () => {
        this.cartCount.next(this.getCartCount(true));
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
      },
    });
  }

  openCart(): void {
    this.cartOpened.next(true);
  }

  closeCart(): void {
    this.cartOpened.next(false);
  }

  clearCart(): void {
    this.cartCount.next(0);
  }
}
