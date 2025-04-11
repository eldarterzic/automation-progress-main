
export interface UseCase {
  id: string;
  title: string;
  description: string;
  category: string;
  currentLevel: number;
  targetLevel?: number;
  developmentYear?: number;
  processSteps?: string[];
  stakeholders?: string[];
  benefits?: string[];
  channelLevels?: Record<string, number>;
  inProduction?: boolean;
  channels?: string[];
  developmentTime?: 'S' | 'M' | 'L';
  // Revenue impact data
  revenueImpact?: number;
  implementationCost?: number;
}
