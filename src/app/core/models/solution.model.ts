export interface SolutionFeature {
  title: string;
  description?: string;
}

export interface Solution {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  features: SolutionFeature[];
  benefits: string[];
  metrics?: { label: string; value: string }[];
}
