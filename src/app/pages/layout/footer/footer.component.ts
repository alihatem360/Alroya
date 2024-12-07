import { BaseService } from './../../../shared/services/Base/base.service';
import { Component, OnInit } from '@angular/core';
import { CompanyInfo } from '../../../shared/models/interfaces/CompanyInfo';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  companyInfo: CompanyInfo | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(public BaseService: BaseService) {}

  ngOnInit(): void {
    this.fetchCompanyInfo();
  }

  fetchCompanyInfo(): void {
    this.BaseService.getCompanyInfo().subscribe((info) => {
      this.companyInfo = info;
    });
  }
}
