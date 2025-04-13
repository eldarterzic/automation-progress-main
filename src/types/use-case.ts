
export interface UseCase {
  id: string;
  name: string;
  purpose: string;
  businessUnit: string;
  monthlyReach: number;
  channelCosts?: string;
  timeToDevelop: number;
  timeToOptimize?: number;
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
  inProduction?: string;
  channels?: string[];
  developmentTime?: 'S' | 'M' | 'L';
  // Revenue impact data
  revenueImpact?: number;
  implementationCost?: number;
}
