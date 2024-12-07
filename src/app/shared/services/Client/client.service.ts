import { Injectable } from '@angular/core';
import { ClientViewModel } from '../../models/interfaces/Client';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { BaseService } from '../Base/base.service';
import { APIConstant } from '../../constant/APIConstant';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private clientSubject = new BehaviorSubject<ClientViewModel | null>(null);
  client$ = this.clientSubject.asObservable();

  constructor(
    private authService: AuthService,
    private baseService: BaseService
  ) {
    this.loadCurrentClient();
  }

  private loadCurrentClient(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user) {
          this.baseService
            .getById<ClientViewModel>(`${APIConstant.Clients}/${user.Id}`)
            .subscribe({
              next: (client) => {
                this.clientSubject.next(client);
              },
              error: () => {
                this.clientSubject.next(null);
              },
            });
        }
      },
      error: () => {
        this.clientSubject.next(null); // or handle error as needed
      },
    });
  }

  updateClient(client: ClientViewModel): void {
    this.clientSubject.next(client);
  }

  refreshClient(): void {
    this.loadCurrentClient();
  }
}
