import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UseCase } from '@/types/use-case';
import { motion } from 'framer-motion';

const channels = ["Reach", "SOME", "Google", "AI/ML", "Web", "Email", "SMS", "Rådgiv", "Kunfej", "Rapport", "CLV", "Kanalpr.", "Churn", "Offering", "Pricing"];

// Status levels and their corresponding colors
const statusLevels = [{
  value: 0,
  label: "Not planned",
  color: "bg-transparent"
}, {
  value: 1,
  label: "Backlog",
  color: "bg-amber-200"
}, {
  value: 2,
  label: "On roadmap",
  color: "bg-amber-500"
}, {
  value: 3,
  label: "Deployed",
  color: "bg-green-500"
}];

interface AutomationMatrixProps {
  useCases: UseCase[];
}

const AutomationMatrix = ({ useCases }: AutomationMatrixProps) => {
  // Group use cases by category
  const groupedUseCases = useCases.reduce((acc, useCase) => {
    if (!acc[useCase.category]) {
      acc[useCase.category] = [];
    }
    acc[useCase.category].push(useCase);
    return acc;
  }, {} as Record<string, typeof useCases>);
  
  const categories = Object.keys(groupedUseCases);
  
  const [activeCategory, setActiveCategory] = useState(categories[0] || '');
  const [automationLevels, setAutomationLevels] = useState<Record<string, Record<string, number>>>({});
  
  // Initialize automationLevels with any existing channelLevels from use cases
  React.useEffect(() => {
    const levels: Record<string, Record<string, number>> = {};
    
    useCases.forEach(useCase => {
      if (useCase.channelLevels) {
        levels[useCase.id] = { ...useCase.channelLevels };
      }
    });
    
    if (Object.keys(levels).length > 0) {
      setAutomationLevels(levels);
    }
  }, [useCases]);
  
  const toggleAutomationLevel = (useCaseId: string, channel: string) => {
    setAutomationLevels(prev => {
      const currentLevels = prev[useCaseId] || {};
      const currentLevel = currentLevels[channel] || 0;

      // Cycle through status levels (0 -> 1 -> 2 -> 3 -> 0)
      const newLevel = (currentLevel + 1) % statusLevels.length;
      return {
        ...prev,
        [useCaseId]: {
          ...currentLevels,
          [channel]: newLevel
        }
      };
    });
  };
  
  const getStatusLevel = (useCaseId: string, channel: string) => {
    const useCase = useCases.find(uc => uc.id === useCaseId);
    
    // First check if the use case has channelLevels directly from import
    if (useCase?.channelLevels?.[channel] !== undefined) {
      return useCase.channelLevels[channel];
    }
    
    // Otherwise use the local state
    const useCaseLevels = automationLevels[useCaseId] || {};
    return useCaseLevels[channel] || 0;
  };
  
  const getStatusColor = (level: number) => {
    return statusLevels.find(status => status.value === level)?.color || "bg-transparent";
  };
  
  const getStatusLabel = (level: number) => {
    return statusLevels.find(status => status.value === level)?.label || "Not planned";
  };
  
  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-6">Target Automation Level</h2>
        
        <div className="flex flex-wrap gap-4 mb-6">
          {statusLevels.map(status => (
            <div key={status.value} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${status.color} border border-gray-300`}></div>
              <span className="text-sm">{status.label}</span>
            </div>
          ))}
        </div>
        
        {categories.length > 0 ? (
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="mb-6 bg-gray-100 p-1 rounded-lg">
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map(category => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-[300px] font-medium">Use Case</TableHead>
                        {channels.map(channel => (
                          <TableHead key={channel} className="text-center font-medium">
                            {channel}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupedUseCases[category]?.map(useCase => (
                        <TableRow key={useCase.id}>
                          <TableCell className="font-medium">{useCase.title}</TableCell>
                          {channels.map(channel => {
                            const statusLevel = getStatusLevel(useCase.id, channel);
                            const statusColor = getStatusColor(statusLevel);
                            const statusLabel = getStatusLabel(statusLevel);
                            return (
                              <TableCell key={`${useCase.id}-${channel}`} className="text-center">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div 
                                        className="flex justify-center cursor-pointer" 
                                        onClick={() => toggleAutomationLevel(useCase.id, channel)}
                                      >
                                        <div className={`w-6 h-6 rounded ${statusColor} border border-gray-300`}></div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{statusLabel}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center p-10 border rounded-lg">
            <p className="text-gray-500">No use cases available. Import data to get started.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AutomationMatrix;
