import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { CompanyInfo } from '../../../../shared/models/interfaces/CompanyInfo';
import { BaseService } from '../../../../shared/services/Base/base.service';

@Component({
  selector: 'app-about-us-section',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './about-us-section.component.html',
  styleUrl: './about-us-section.component.scss',
})
export class AboutUsSectionComponent implements OnInit {
  companyInfo: CompanyInfo | null = null;

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
