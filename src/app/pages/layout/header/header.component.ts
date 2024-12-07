import { BaseService } from './../../../shared/services/Base/base.service';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { SharedModule } from './../../../shared/shared.module';
import { SignalRService } from '../../../shared/services/SignalR/signal-r.service';
import { NotificationViewModel } from '../../../shared/models/interfaces/Notification';
import { ClientService } from '../../../shared/services/Client/client.service';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { ClientViewModel } from '../../../shared/models/interfaces/Client';
import { CartService } from '../../../shared/services/Cart/CartSevices';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LanguageService } from '../../../shared/services/Language/LanguageService';
import { WishlistService } from '../../../shared/services/Whislist/WishlistService';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SharedModule, MatBadgeModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  client: ClientViewModel | null = null;
  imageUrl = environment.imageUrl;
  notifications: NotificationViewModel[] = [];
  unreadNotificationsCount: number = 0;
  isNavbarCollapsed = true;
  isActive: boolean = false;
  cartCount: number = 0;

  searchInputValue: string = '';
  @ViewChild('searchInput') searchInput!: ElementRef;
  @Input() wishlistCount: number = 0;
  @Input() currentLanguage: string = 'ar';
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private signalRService: SignalRService,
    private authService: AuthService,
    public languageService: LanguageService,
    private clientService: ClientService,
    private cartService: CartService,
    public baseService: BaseService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeSubscriptions();
  }
  ngOnDestroy(): void {
    this.cleanupSubscriptions();
    this.signalRService.stopConnection();
  }
  logout(): void {
    this.authService.logout();
    this.wishlistService.intiWhislist();
    this.baseService.navigateToPage('/home');
  }
  scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
  closeOffcanvas(): void {
    this.cartService.closeOffcanvas();
  }

  search(): void {
    if (this.searchInputValue) {
      this.router.navigate([
        '/',
        this.baseService.currentLanguage,
        'search',
        this.searchInputValue,
      ]);
    }
  }

  toggleSearch(): void {
    if (!this.isActive) {
      this.isActive = true;
      setTimeout(() => this.searchInput.nativeElement.focus(), 0);
    } else {
      this.search();
      this.isActive = false;
    }
  }

  onKey(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.search();
    }
  }
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (this.isActive && this.searchInput?.nativeElement) {
      const searchContainer =
        this.searchInput.nativeElement.closest('.search-container');
      if (searchContainer && !searchContainer.contains(target)) {
        this.isActive = false;
      }
    }
  }

  private initializeSubscriptions(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.cartService.getCartCount(null);
      }
    });
    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });

    this.clientService.client$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((client) => {
        this.client = client;
      });
  }

  private cleanupSubscriptions(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private calculateUnreadNotificationsCount(): void {
    this.unreadNotificationsCount = this.notifications.filter(
      (notification) => !notification.seen
    ).length;
  }

  showNotify = false;
}
