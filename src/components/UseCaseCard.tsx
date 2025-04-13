
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UseCase } from '@/types/use-case';

interface UseCaseCardProps {
  useCase: UseCase;
  view?: 'grid' | 'list';
  onSelect?: () => void;
  delay?: number;
}

const UseCaseCard = ({ useCase, view = 'grid', onSelect, delay = 0 }: UseCaseCardProps) => {
  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay }}
        className="bg-white p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-all hover:shadow-md"
      >
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs font-normal">
                {useCase.businessUnit}
              </Badge>
              <span className="text-xs text-gray-500">Production</span>
              <div className={`w-2 h-2 rounded-full ${getAutomationLevelColor(useCase.inProduction)}`}></div>             
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">{useCase.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{useCase.purpose}</p>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="gap-1 hover:gap-2 transition-all" onClick={onSelect}>
              Map Use Case <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white p-5 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all h-full flex flex-col hover-lift"
    >
      <div className="flex items-center justify-between mb-3">
        <Badge variant="outline" className="text-xs font-normal">
          {useCase.businessUnit}
        </Badge>
        <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Production</span>
        <div className={`w-2 h-2 rounded-full ${getAutomationLevelColor(useCase.inProduction)}`}></div>
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{useCase.name}</h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-grow">{useCase.purpose}</p>
      <Button variant="ghost" size="sm" className="gap-1 hover:gap-2 transition-all mt-auto self-start" onClick={onSelect}>
        Map Use Case <ArrowRight className="h-4 w-4" />
      </Button>
    </motion.div>
  );
};

// Helper function to get color based on automation level
function getAutomationLevelColor(level: string): string {
  switch (level) {
    case "Yes": return 'bg-green-400';
    case "No": return 'bg-red-400';
    default: return 'bg-gray-400';
  }
}

export default UseCaseCard;
