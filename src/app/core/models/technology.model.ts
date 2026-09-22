export interface TechItem {
  name: string;
  category: 'frontend' | 'backend' | 'data' | 'tools';
  description: string;
}

export interface TechLayer {
  title: string;
  subtitle: string;
  items: TechItem[];
}
