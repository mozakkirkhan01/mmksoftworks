import { Industry } from '../../core/models/industry.model';

export const INDUSTRIES_DATA: Industry[] = [
  {
    id: 'education',
    slug: 'education',
    title: 'Education',
    description: 'Schools, colleges, coaching institutes, and universities seeking paperless administration and fee automation.',
    icon: 'education-hat',
    keyModules: ['Student Records', 'Fee Collection', 'Online Exams', 'Attendance Alerts']
  },
  {
    id: 'travel',
    slug: 'travel',
    title: 'Travel & Tourism',
    description: 'Tour operators, travel agencies, and destination management companies needing instant PDF quotation generators.',
    icon: 'airplane',
    keyModules: ['Lead CRM', 'Itinerary Builder', 'Hotel Contracting', 'Package Pricing']
  },
  {
    id: 'retail',
    slug: 'retail',
    title: 'Retail & Wholesale',
    description: 'Supermarkets, distributors, and retail chains requiring high-speed POS billing and batch inventory control.',
    icon: 'shopping-cart',
    keyModules: ['Multi-Counter POS', 'Barcode Inventory', 'GST Invoicing', 'Supplier Accounts']
  },
  {
    id: 'healthcare',
    slug: 'healthcare',
    title: 'Healthcare & Clinics',
    description: 'Hospitals, eye care clinics, pharmacies, and diagnostic labs prioritizing seamless patient care workflows.',
    icon: 'medical-cross',
    keyModules: ['OPD Token System', 'Electronic Health Records', 'Pharmacy Billing', 'Surgery OT']
  },
  {
    id: 'cooperative',
    slug: 'cooperative-societies',
    title: 'Cooperative Societies',
    description: 'Credit cooperative societies, thrift unions, and financial institutes complying with RCS guidelines.',
    icon: 'community-users',
    keyModules: ['Member KYC & Shares', 'FD/RD Deposits', 'Loan & Surety Ledger', 'RCS Balance Sheet']
  },
  {
    id: 'sme-businesses',
    slug: 'growing-businesses',
    title: 'Growing Businesses & SMEs',
    description: 'Manufacturing units, service agencies, and trading companies replacing disconnected spreadsheets with smart software.',
    icon: 'office-building',
    keyModules: ['Custom ERP', 'WhatsApp Alerts', 'Payment Gateways', 'Executive Analytics']
  }
];
