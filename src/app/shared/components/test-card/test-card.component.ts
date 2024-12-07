import { Component, Input, Output } from '@angular/core';
import { BaseService } from '../../services/Base/base.service';
import { TestViewModel } from '../../models/interfaces/Test';
import { SharedModule } from '../../shared.module';
import { APIConstant } from '../../constant/APIConstant';
import { WishlistService } from '../../services/Whislist/WishlistService';
import { whislistViewModel } from '../../models/interfaces/wishlistViewModel';
import { CartService } from '../../services/Cart/CartSevices';
import { ProductType } from '../../models/classes/ProductType';
import { KitchensProgramsViewModel } from '../../models/interfaces/Kitchens';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-test-card',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './test-card.component.html',
  styleUrl: './test-card.component.scss',
})
export class TestCardComponent {
  imageUrl = environment.imageUrl;
  ProductType = ProductType;

  constructor(
    public baseService: BaseService,
    private wishListService: WishlistService,
    public cartServices: CartService
  ) {}
  @Input() test!: TestViewModel;

  wishListItems: whislistViewModel[] | null = null;

  ngOnInit(): void {
    this.wishListService.wishlitsItems$.subscribe(
      (items) => (this.wishListItems = items)
    );
  }

  addTestToWishList() {
    this.wishListItems = null;
    const wishlistItem = {
      testId: this.test.id,
    };
    this.wishListService.addToWishlist(wishlistItem);
  }

  removeTestFromWishList() {
    this.wishListItems = null;
    const wishlistItem = {
      testId: this.test.id,
    };
    this.wishListService.removeFromWishlist(wishlistItem);
  }

  isTestInWishList(): boolean | undefined {
    if (this.wishListItems) {
      if (this.wishListItems.map((w) => w.testId).includes(this.test.id)) {
        return true;
      }
      return false;
    }
    return undefined;
  }
}
