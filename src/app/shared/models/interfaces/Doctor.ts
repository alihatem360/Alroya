import { LookupViewModel } from '../classes/LookupViewModel';

export interface DoctorViewModel {
  id: number;
  nameEn: string;
  nameAr: string;
  description: string;
  image: string;
  email: string;
  isActive: boolean;
  userId: string;
  specialties: LookupViewModel[];
}

export interface ConsultantDto {
  id: number;
  type: number;
  typeName: string;
  image: string;
  nameAr: string;
  nameEn: string;
}
