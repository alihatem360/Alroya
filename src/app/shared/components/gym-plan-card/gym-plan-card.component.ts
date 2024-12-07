import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ProductType } from '../../models/classes/ProductType';
import { WishlistService } from '../../services/Whislist/WishlistService';
import { BaseService } from '../../services/Base/base.service';
import { CartService } from '../../services/Cart/CartSevices';
import { PlansViewModel } from '../../models/interfaces/Plans';
import { whislistViewModel } from '../../models/interfaces/wishlistViewModel';
import { SharedModule } from '../../shared.module';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-gym-plan-card',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './gym-plan-card.component.html',
  styleUrls: ['./gym-plan-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GymPlanCardComponent implements OnInit, OnDestroy {
  imageUrl = environment.imageUrl;
  ProductType = ProductType;

  @Input() gymPlans!: PlansViewModel;

  private readonly unsubscribe$ = new Subject<void>();
  wishListItems: whislistViewModel[] | null = null;

  constructor(
    public baseService: BaseService,
    private wishListService: WishlistService,
    public cartServices: CartService
  ) {}

  ngOnInit(): void {
    this.loadWishlistItems();
  }

  private loadWishlistItems(): void {
    this.wishListService.wishlitsItems$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((items) => {
        this.wishListItems = items;
      });
  }

  addProgramToWishList(): void {
    this.updateWishlist(null);
    const wishlistItem = this.createWishlistItem();
    this.wishListService.addToWishlist(wishlistItem);
  }

  removeProgramFromWishList(): void {
    this.updateWishlist(null); 
    const wishlistItem = this.createWishlistItem();
    this.wishListService.removeFromWishlist(wishlistItem);
  }

  isProgramInWishList(): boolean {
    return (
      this.wishListItems?.some((item) => item.gymPlanId === this.gymPlans.id) ||
      false
    );
  }

  private createWishlistItem(): { GymPlanId: number } {
    return { GymPlanId: this.gymPlans.id };
  }

  private updateWishlist(items: whislistViewModel[] | null): void {
    this.wishListItems = items;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete(); 
  }
}
