import { Service } from '../../core/models/service.model';

export const SERVICES_DATA: Service[] = [
  {
    id: 'custom-erp',
    slug: 'custom-erp-development',
    title: 'Custom ERP Development',
    shortDescription: 'Purpose-built ERP platforms tailored to your organization\'s unique operational workflow.',
    fullDescription: 'We architect and build customized Enterprise Resource Planning systems designed around how your company actually functions. From multi-branch inventory control to complex accounting rules, we build software that fits like a glove.',
    icon: 'cpu-chip',
    deliverables: [
      'Tailored Workflow Mapping',
      'Database Architecture & Design',
      'Role-Based Permission Systems',
      'Multi-Branch Data Syncing',
      'Custom Executive Dashboards'
    ]
  },
  {
    id: 'web-app',
    slug: 'web-application-development',
    title: 'Web Application Development',
    shortDescription: 'Modern responsive applications built for speed, reliability, and supreme usability.',
    fullDescription: 'High-performance single-page applications and customer portals built with Angular and ASP.NET Core. Clean UI/UX design, sub-second response times, and bulletproof security.',
    icon: 'device-desktop',
    deliverables: [
      'Single Page Applications (SPA)',
      'Admin Dashboards & Portals',
      'Customer & Vendor Portals',
      'Responsive Mobile-First Interfaces',
      'High-Speed State Management'
    ]
  },
  {
    id: 'automation',
    slug: 'business-automation',
    title: 'Business Automation',
    shortDescription: 'Automate repetitive workflows and reduce expensive manual operations.',
    fullDescription: 'Eliminate manual data entry, spreadsheet copy-pasting, and missed client follow-ups. We create automated trigger systems that process orders, issue invoices, send WhatsApp updates, and update stock automatically.',
    icon: 'cog',
    deliverables: [
      'Workflow Bottleneck Analysis',
      'Automated Email & WhatsApp Alerts',
      'Scheduled EOD Report Generation',
      'Approval Chain Automation',
      'Database Sync Scripts'
    ]
  },
  {
    id: 'api-integration',
    slug: 'api-system-integration',
    title: 'API & System Integration',
    shortDescription: 'Connect existing software, payment gateways, messaging services, and external APIs.',
    fullDescription: 'Break down data silos across your organization. We bridge your ERP or web platform with payment gateways (Razorpay, UPI), communication APIs (WhatsApp, SMS), shipping aggregators, and Tally accounting.',
    icon: 'arrows-pointing-out',
    deliverables: [
      'Payment Gateway Integration',
      'WhatsApp Business API Setup',
      'SMS Gateway Connectors',
      'Tally Data Synchronization',
      'Third-Party RESTful API Wrappers'
    ]
  },
  {
    id: 'reporting-analytics',
    slug: 'reporting-analytics',
    title: 'Reporting & Analytics',
    shortDescription: 'Turn raw operational data into useful, real-time business insights and executive reports.',
    fullDescription: 'Transform gigabytes of raw database transactions into clear, actionable charts, financial balance sheets, profit-margin analysis, and automated PDF export reports.',
    icon: 'chart-bar',
    deliverables: [
      'Real-Time Executive Dashboards',
      'Custom SQL Stored Procedure Reporting',
      'Exportable Excel & PDF Statements',
      'Departmental KPI Metrics',
      'Scheduled Email Summaries'
    ]
  },
  {
    id: 'maintenance-support',
    slug: 'maintenance-support',
    title: 'Maintenance & Support',
    shortDescription: 'Continuous technical improvements, active monitoring, security patches, and direct support.',
    fullDescription: 'Software is a long-term asset. We provide dedicated technical support, database optimization, periodic backups, server health monitoring, and continuous feature additions as your business expands.',
    icon: 'shield-check',
    deliverables: [
      'SLA-Backed Technical Support',
      'Database Tuning & Maintenance',
      'Server & Cloud Monitoring',
      'Periodic Automated Backups',
      'Feature Enhancements & Upgrades'
    ]
  }
];
