
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UseCase } from '@/types/use-case';

interface AutomationLevelMapperProps {
  useCase: UseCase;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, newLevel: number) => void;
}

const levelDescriptions = [
  "Manual: Entirely human-operated process with no automation",
  "Assisted: Basic tools support the manual process",
  "Partial: Key parts of the process are automated",
  "Conditional: Automation with human supervision",
  "Supervised: Mostly automated with minimal human intervention",
  "Autonomous: Fully automated end-to-end process"
];

const AutomationLevelMapper = ({ useCase, open, onOpenChange, onSave }: AutomationLevelMapperProps) => {
  const [currentLevel, setCurrentLevel] = useState(useCase.currentLevel);
  const [targetLevel, setTargetLevel] = useState(useCase.targetLevel || useCase.currentLevel + 1);
  
  const handleSave = () => {
    onSave(useCase.id, currentLevel);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">Map Automation Level</DialogTitle>
          <DialogDescription>
            Define current and target automation levels for <span className="font-medium text-foreground">{useCase.title}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-8 py-4">
          {/* Current Level */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Current Automation Level</h3>
              <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
                Level {currentLevel}
              </div>
            </div>
            
            <Slider
              value={[currentLevel]}
              min={0}
              max={5}
              step={1}
              onValueChange={(value) => setCurrentLevel(value[0])}
              className="py-4"
            />
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm">{levelDescriptions[currentLevel]}</p>
            </div>
          </div>
          
          {/* Target Level */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Target Automation Level</h3>
              <div className="bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-sm font-medium">
                Level {targetLevel}
              </div>
            </div>
            
            <Slider
              value={[targetLevel]}
              min={0}
              max={5}
              step={1}
              onValueChange={(value) => setTargetLevel(value[0])}
              className="py-4"
            />
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm">{levelDescriptions[targetLevel]}</p>
            </div>
          </div>
          
          {/* Automation Gap Visualization */}
          <div className="pt-4">
            <h3 className="text-sm font-medium mb-3">Automation Journey</h3>
            <div className="relative h-16">
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 rounded-full transform -translate-y-1/2"></div>
              
              {Array.from({ length: 6 }).map((_, index) => (
                <div 
                  key={index}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ left: `${index * 20}%` }}
                >
                  <div 
                    className={`w-4 h-4 rounded-full border-2 ${
                      index === currentLevel 
                        ? 'bg-primary border-primary' 
                        : index === targetLevel 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'bg-white border-gray-300'
                    }`}
                  ></div>
                  <span className="text-xs mt-2">{index}</span>
                </div>
              ))}
              
              {currentLevel < targetLevel && (
                <motion.div 
                  className="absolute top-1/2 h-1 bg-blue-200 rounded-full transform -translate-y-1/2"
                  style={{ 
                    left: `${currentLevel * 20}%`, 
                    width: `${(targetLevel - currentLevel) * 20}%` 
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(targetLevel - currentLevel) * 20}%` }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Mapping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AutomationLevelMapper;
