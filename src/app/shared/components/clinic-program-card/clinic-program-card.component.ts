import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ClinicsProgramsViewModel } from '../../models/interfaces/Clinics';
import { CartService } from '../../services/Cart/CartSevices';
import { ProductType } from '../../models/classes/ProductType';
import { BaseService } from '../../services/Base/base.service';
import { WishlistService } from '../../services/Whislist/WishlistService';
import { whislistViewModel } from '../../models/interfaces/wishlistViewModel';
import { SharedModule } from '../../shared.module';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-clinic-program-card',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './clinic-program-card.component.html',
  styleUrls: ['./clinic-program-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicProgramCardComponent implements OnInit, OnDestroy {
  imageUrl = environment.imageUrl;
  ProductType = ProductType;

  @Input() clinicPrograms!: ClinicsProgramsViewModel;

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
        (item) => item.clinicProgramId === this.clinicPrograms.id
      ) || false
    );
  }

  private createWishlistItem(): { ClinicProgramId: number } {
    return { ClinicProgramId: this.clinicPrograms.id };
  }

  private updateWishlist(items: whislistViewModel[] | null): void {
    this.wishListItems = items;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
