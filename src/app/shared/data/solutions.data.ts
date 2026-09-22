import { Solution } from '../../core/models/solution.model';

export const SOLUTIONS_DATA: Solution[] = [
  {
    id: 'school-erp',
    slug: 'school-erp',
    title: 'School ERP',
    subtitle: 'End-to-End Educational Institution Management',
    category: 'Education',
    badge: 'Popular',
    shortDescription: 'Streamline admissions, student records, fee collection, attendance, examinations, and staff management in one unified platform.',
    fullDescription: 'MMK School ERP is engineered specifically for modern schools, colleges, and educational institutes in India. Automate fee receipts, SMS/WhatsApp notifications, online report cards, and parent communications.',
    icon: 'academic-cap',
    features: [
      { title: 'Student Management', description: 'Complete digital student profiles from admission to transfer certificates.' },
      { title: 'Fee Management', description: 'Automated fee structure design, receipt generation, late fee calculation, and SMS alerts.' },
      { title: 'Attendance', description: 'Biometric, RFID, and manual attendance tracking for students and staff.' },
      { title: 'Examinations', description: 'Marks entry, grade computation, rank generation, and printable report cards.' },
      { title: 'Staff Management', description: 'Teacher workload scheduling, leave management, and monthly payroll processing.' },
      { title: 'Reports', description: 'Comprehensive financial, academic, and administrative compliance analytics.' }
    ],
    benefits: [
      'Reduce fee collection delays by 60% with automated WhatsApp reminders.',
      'Paperless examination and instant report card generation.',
      'Parent portal with real-time fee payment and attendance tracking.'
    ],
    metrics: [
      { label: 'Operational Efficiency', value: '+75%' },
      { label: 'Manual Paperwork Saved', value: '80%' }
    ]
  },
  {
    id: 'travel-erp',
    slug: 'travel-erp',
    title: 'Travel & Tour ERP',
    subtitle: 'Comprehensive Itinerary & Quotation Management',
    category: 'Travel & Tourism',
    badge: 'Signature',
    shortDescription: 'Manage leads, build instant custom itineraries, calculate package margins, track hotel reservations, and export PDF quotations.',
    fullDescription: 'Built for travel agencies and tour operators. Eliminate spreadsheet errors with instant pricing calculation for hotels, transport, activities, and taxes.',
    icon: 'airplane',
    features: [
      { title: 'Lead Management', description: 'Capture customer inquiries from web forms, WhatsApp, and phone calls.' },
      { title: 'Quotation Builder', description: 'Generate multi-option professional PDF itineraries with itemized cost breakdowns.' },
      { title: 'Hotels & Contracting', description: 'Manage seasonal hotel rates, meal plans, extra bed charges, and blackout dates.' },
      { title: 'Transportation', description: 'Driver assignment, cab rate charts, and fuel/toll expense tracking.' },
      { title: 'Activities & Attractions', description: 'Ticket pricing, slot management, and vouchers.' },
      { title: 'Package Pricing & PDF', description: 'Automated profit margin calculation and single-click branded WhatsApp/Email PDF quotes.' }
    ],
    benefits: [
      'Generate polished travel itineraries in under 3 minutes.',
      'Prevent booking revenue leaks with automated vendor payment reconciliation.',
      'Instant customer approval via integrated digital quotes.'
    ],
    metrics: [
      { label: 'Quotation Speed', value: '< 3 Mins' },
      { label: 'Conversion Boost', value: '+40%' }
    ]
  },
  {
    id: 'retail-erp',
    slug: 'retail-erp',
    title: 'Retail ERP',
    subtitle: 'Smart Inventory & GST POS Solution',
    category: 'Retail & Commerce',
    badge: 'High Performance',
    shortDescription: 'Real-time inventory tracking, multi-counter POS billing, purchase management, GST compliance, and daily daybook analytics.',
    fullDescription: 'Empower retail stores, supermarkets, and distributors with lightning-fast barcode billing, batch/expiry tracking, and automated GST return filing reports.',
    icon: 'shopping-cart',
    features: [
      { title: 'Inventory Control', description: 'Real-time stock valuation, low-stock reorder triggers, and barcode management.' },
      { title: 'Sales & POS Billing', description: 'Ultra-fast counter billing supporting keyboard shortcuts, thermal printers, and UPI.' },
      { title: 'Purchases & Vendors', description: 'Purchase orders, inward GRNs, supplier credit tracking, and rate comparisons.' },
      { title: 'GST & Invoicing', description: 'GSTR-1, GSTR-3B compliant e-invoicing and e-way bill integrations.' },
      { title: 'Daybook & Cashflow', description: 'Real-time cash counter reconciliation and shift-wise sales summaries.' },
      { title: 'Analytics', description: 'Fast-moving vs slow-moving item reports and customer buying trends.' }
    ],
    benefits: [
      'Eliminate stockout losses with intelligent reorder points.',
      'Sub-second billing speed for peak store rush hours.',
      '100% compliant GST invoicing with direct portal reporting.'
    ]
  },
  {
    id: 'hospital-erp',
    slug: 'hospital-erp',
    title: 'Hospital & Clinic ERP',
    subtitle: 'Patient Care & Medical Operations Platform',
    category: 'Healthcare',
    badge: 'Enterprise',
    shortDescription: 'OPD/IPD management, electronic health records, pharmacy billing, surgery scheduling, optical, and diagnostic lab reports.',
    fullDescription: 'Purpose-built for eye hospitals, multi-specialty clinics, and diagnostic centers. Maintain patient medical history, digital prescriptions, and multi-counter billing.',
    icon: 'hospital',
    features: [
      { title: 'OPD & Patient Registration', description: 'Token generation, doctor appointment scheduling, and patient EMR history.' },
      { title: 'Prescriptions & Clinical Notes', description: 'Digital doctor prescriptions with dosage templates and investigation orders.' },
      { title: 'Pharmacy Integration', description: 'Batch-wise medicine billing, drug interaction alerts, and expiry management.' },
      { title: 'Surgery & OT Scheduling', description: 'Operation theatre booking, surgical team consent, and IPD package billing.' },
      { title: 'Billing & TPA Insurance', description: 'Itemized hospital bills, discount permissions, and insurance claim tracking.' },
      { title: 'Inventory & Reports', description: 'Surgical consumable tracking and department-wise daily revenue metrics.' }
    ],
    benefits: [
      'Streamline patient wait times in OPD by over 50%.',
      'Zero billing errors between pharmacy, diagnostics, and IPD discharge.',
      'Complete patient medical history accessible in one click.'
    ]
  },
  {
    id: 'cooperative-erp',
    slug: 'cooperative-erp',
    title: 'Cooperative Society ERP',
    subtitle: 'Financial Management for Societies & Credit Unions',
    category: 'Finance & Banking',
    badge: 'Specialized',
    shortDescription: 'Manage society members, share capital, fixed deposits, recurring deposits, gold/personal loans, interest calculations, and accounting.',
    fullDescription: 'Designed for Credit Cooperative Societies, Thrift Societies, and Employee Unions in India. Compliant with Registrar of Cooperative Societies (RCS) regulations.',
    icon: 'users',
    features: [
      { title: 'Member Directory', description: 'Member KYC, share ledger, nominee details, and dividend distribution.' },
      { title: 'Deposits Management', description: 'FD, RD, MIS, and Pigmy deposit accounts with automated maturity interest.' },
      { title: 'Loans & Sureties', description: 'Gold loan, personal loan, mortgage loan disbursement, EMI schedules, and co-surety tracking.' },
      { title: 'Interest Engine', description: 'Configurable simple/compound interest formulas, penalty rules, and NPA classification.' },
      { title: 'Full Double-Entry Accounting', description: 'General ledger, cashbook, trial balance, and balance sheet.' },
      { title: 'Regulatory Reports', description: 'Standard RCS quarterly audit statements and Member passbooks.' }
    ],
    benefits: [
      'Automate monthly loan EMI interest calculation across thousands of members.',
      '100% audit-ready financial statements and balance sheet.',
      'Automated SMS notification on deposit maturity and loan overdue.'
    ]
  },
  {
    id: 'business-automation',
    slug: 'business-automation',
    title: 'Business Automation Platform',
    subtitle: 'Workflow & Integration Engine',
    category: 'Automation',
    badge: 'Core Engine',
    shortDescription: 'Automate repetitive workflows, send instant WhatsApp/SMS transactional alerts, integrate payment gateways, and trigger scheduled reports.',
    fullDescription: 'Connect your isolated business databases with automated triggers. Eliminate manual follow-ups, paper forms, and copy-pasting between systems.',
    icon: 'bolt',
    features: [
      { title: 'Workflow Automation', description: 'Custom rule-based triggers (e.g., auto-assign lead on form submission).' },
      { title: 'WhatsApp & SMS Gateway', description: 'Official Meta WhatsApp Business API integration for receipts and updates.' },
      { title: 'Payment Gateways', description: 'Razorpay, Cashfree, and PayU payment links embedded in invoices.' },
      { title: 'Automated Notifications', description: 'Instant email/SMS triggers for approvals, payment receipts, and low stock.' },
      { title: 'API Integrations', description: 'RESTful API connections to third-party CRMs, Tally, and cloud storage.' },
      { title: 'Reporting Engine', description: 'Scheduled daily EOD summary emails sent directly to business owners.' }
    ],
    benefits: [
      'Save 15+ hours of manual administrative labor every week.',
      'Collect payments 3x faster via WhatsApp auto-payment links.',
      'Zero human entry errors in routine notifications.'
    ]
  },
  {
    id: 'custom-erp',
    slug: 'custom-erp',
    title: 'Custom ERP Development',
    subtitle: 'Tailor-Made Enterprise Software',
    category: 'Enterprise',
    badge: 'Bespoke',
    shortDescription: 'Custom software designed from scratch around your specific business model, internal workflows, and operational hierarchy.',
    fullDescription: 'When off-the-shelf software fails to fit your unique operational processes, MMK Softworks builds custom web and database architectures tailored to your exact business rules.',
    icon: 'code-bracket',
    features: [
      { title: 'Bespoke Architecture', description: 'Zero bloated unnecessary features; built around your actual daily operations.' },
      { title: 'Role-Based Security', description: 'Granular user permission matrices for admins, managers, operators, and auditors.' },
      { title: 'Database Optimization', description: 'High-speed MS SQL database architecture supporting millions of records.' },
      { title: 'Seamless Upgrades', description: 'Modular architecture allowing endless future feature additions.' }
    ],
    benefits: [
      '100% alignment with your established business processes.',
      'No expensive recurring per-user licensing fees.',
      'Full ownership of custom business logic and data.'
    ]
  }
];
