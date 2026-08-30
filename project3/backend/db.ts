import { CARS_DATA } from '../src/data/cars';
import { BRANCHES_DATA } from '../src/data/branches';
import { BLOG_POSTS_DATA } from '../src/data/blog';
import {
  Car,
  Branch,
  BookingDetails,
  AppUser,
  BlogPost,
  RoadsideTicket,
  InspectionReport,
  CorporateInquiry,
  SystemAuditLog
} from '../src/types';

// In-Memory & Database Adapter Layer for Al-Rufqah Production
export class AlRufqahDataStore {
  public cars: Car[] = [...CARS_DATA];
  public branches: Branch[] = [...BRANCHES_DATA];
  public blogPosts: BlogPost[] = [...BLOG_POSTS_DATA];
  
  public users: AppUser[] = [];

  public bookings: BookingDetails[] = [];

  public roadsideTickets: RoadsideTicket[] = [];

  public corporateInquiries: CorporateInquiry[] = [];

  public inspectionReports: InspectionReport[] = [];

  public auditLogs: SystemAuditLog[] = [];
}

export const db = new AlRufqahDataStore();
