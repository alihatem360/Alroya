import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { whislistViewModel } from '../../models/interfaces/wishlistViewModel';
import { KitchensProgramsViewModel } from '../../models/interfaces/Kitchens';
import { CartService } from '../../services/Cart/CartSevices';
import { WishlistService } from '../../services/Whislist/WishlistService';
import { BaseService } from '../../services/Base/base.service';
import { ProductType } from '../../models/classes/ProductType';
import { SharedModule } from '../../shared.module';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-kitchen-program-card',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './kitchen-program-card.component.html',
  styleUrls: ['./kitchen-program-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchenProgramCardComponent implements OnInit {
  imageUrl = environment.imageUrl;
  ProductType = ProductType;
  @Input() kitchenPrograms!: KitchensProgramsViewModel;
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
      this.wishListItems?.some(
        (item) => item.kitchenProgramId === this.kitchenPrograms.id
      ) || false
    );
  }

  private createWishlistItem(): { KitchenProgramId: number } {
    return { KitchenProgramId: this.kitchenPrograms.id };
  }

  private updateWishlist(items: whislistViewModel[] | null): void {
    this.wishListItems = items;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
