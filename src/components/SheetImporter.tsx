
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { fetchUseCasesFromSheet, fetchTargetLevelsFromSheet, fetchReportingDataFromSheet, mergeUseCases, ReportingData } from '@/utils/googleSheets';
import { UseCase } from '@/types/use-case';
import { Download, FileSpreadsheet } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SheetImporterProps {
  useCases: UseCase[];
  onUpdateUseCases: (newUseCases: UseCase[]) => void;
  onUpdateReportingData?: (data: ReportingData[]) => void;
  isStandalone?: boolean;
}

type ImportType = 'useCases' | 'targetLevels' | 'reportingData';

const SheetImporter: React.FC<SheetImporterProps> = ({ 
  useCases, 
  onUpdateUseCases, 
  onUpdateReportingData,
  isStandalone = false 
}) => {
  const [sheetId, setSheetId] = useState('');
  const [useCasesSheetName, setUseCasesSheetName] = useState('');
  const [targetLevelsSheetName, setTargetLevelsSheetName] = useState('');
  const [reportingDataSheetName, setReportingDataSheetName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ImportType>('useCases');
  
  const handleImport = async () => {
    if (!sheetId) {
      toast({
        title: 'Sheet ID required',
        description: 'Please enter a Google Sheet ID',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Import based on the active tab
      if (activeTab === 'useCases') {
        if (!useCasesSheetName) {
          toast({
            title: 'Sheet name required',
            description: 'Please enter a sheet name for use case metadata',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        const newUseCases = await fetchUseCasesFromSheet({ 
          sheetId,
          sheetName: useCasesSheetName
        });
        
        if (newUseCases.length === 0) {
          toast({
            title: 'No data found',
            description: 'Could not find any valid use cases in the sheet',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }
        
        const mergedUseCases = mergeUseCases(useCases, newUseCases);
        onUpdateUseCases(mergedUseCases);
        
        toast({
          title: 'Data imported successfully',
          description: `Imported ${newUseCases.length} use cases from Google Sheet`,
        });
      } 
      else if (activeTab === 'targetLevels') {
        if (!targetLevelsSheetName) {
          toast({
            title: 'Sheet name required',
            description: 'Please enter a sheet name for target automation levels',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        const updatedUseCases = await fetchTargetLevelsFromSheet({
          sheetId,
          sheetName: targetLevelsSheetName,
          currentUseCases: useCases
        });
        
        if (updatedUseCases.length === 0) {
          toast({
            title: 'No data found',
            description: 'Could not find any valid target levels in the sheet',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }
        
        onUpdateUseCases(updatedUseCases);
        
        toast({
          title: 'Target levels imported successfully',
          description: `Updated target automation levels for use cases`,
        });
      }
      else if (activeTab === 'reportingData') {
        if (!reportingDataSheetName) {
          toast({
            title: 'Sheet name required',
            description: 'Please enter a sheet name for reporting data',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        const reportingData = await fetchReportingDataFromSheet({
          sheetId,
          sheetName: reportingDataSheetName
        });
        
        // Store reporting data in localStorage for now
        localStorage.setItem('reportingData', JSON.stringify(reportingData));
        
        // If callback is provided, update the data in parent component
        if (onUpdateReportingData) {
          onUpdateReportingData(reportingData);
        }
        
        toast({
          title: 'Reporting data imported successfully',
          description: `Updated revenue impact data from Google Sheet`,
        });
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error importing data:', error);
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'Failed to import data from Google Sheet',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Standalone mode renders directly in the admin panel
  if (isStandalone) {
    return (
      <div className="w-full">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="sheetId" className="text-right text-sm">
              Sheet ID
            </label>
            <Input
              id="sheetId"
              value={sheetId}
              onChange={(e) => setSheetId(e.target.value)}
              placeholder="1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="col-span-3"
            />
          </div>
          
          <div className="my-2">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ImportType)}>
              <TabsList className="w-full">
                <TabsTrigger value="useCases">Use Case Metadata</TabsTrigger>
                <TabsTrigger value="targetLevels">Target Automation Levels</TabsTrigger>
                <TabsTrigger value="reportingData">Reporting Data</TabsTrigger>
              </TabsList>
              
              <TabsContent value="useCases" className="mt-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="useCasesSheetName" className="text-right text-sm">
                    Sheet Name
                  </label>
                  <Input
                    id="useCasesSheetName"
                    value={useCasesSheetName}
                    onChange={(e) => setUseCasesSheetName(e.target.value)}
                    placeholder="Use Case Metadata"
                    className="col-span-3"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This sheet should contain columns for id, title, description, category, etc.
                </p>
              </TabsContent>
              
              <TabsContent value="targetLevels" className="mt-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="targetLevelsSheetName" className="text-right text-sm">
                    Sheet Name
                  </label>
                  <Input
                    id="targetLevelsSheetName"
                    value={targetLevelsSheetName}
                    onChange={(e) => setTargetLevelsSheetName(e.target.value)}
                    placeholder="Target Automation Level"
                    className="col-span-3"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This sheet should contain columns for use case id, channel, and automation level.
                </p>
              </TabsContent>
              
              <TabsContent value="reportingData" className="mt-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="reportingDataSheetName" className="text-right text-sm">
                    Sheet Name
                  </label>
                  <Input
                    id="reportingDataSheetName"
                    value={reportingDataSheetName}
                    onChange={(e) => setReportingDataSheetName(e.target.value)}
                    placeholder="Use Case Reporting"
                    className="col-span-3"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This sheet should contain reporting data such as revenue impact, time periods, etc.
                </p>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button onClick={handleImport} disabled={isLoading}>
              {isLoading ? 'Importing...' : 'Import Data'}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Dialog mode renders a button that opens a dialog
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          Import from Google Sheets
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Import Data from Google Sheets</DialogTitle>
          <DialogDescription>
            Enter your Google Sheet details below. Make sure the sheet is published to the web or accessible via link.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="sheetId" className="text-right text-sm">
              Sheet ID
            </label>
            <Input
              id="sheetId"
              value={sheetId}
              onChange={(e) => setSheetId(e.target.value)}
              placeholder="1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="col-span-3"
            />
          </div>
          
          <div className="my-2">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ImportType)}>
              <TabsList className="w-full">
                <TabsTrigger value="useCases">Use Case Metadata</TabsTrigger>
                <TabsTrigger value="targetLevels">Target Automation Levels</TabsTrigger>
                <TabsTrigger value="reportingData">Reporting Data</TabsTrigger>
              </TabsList>
              
              <TabsContent value="useCases" className="mt-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="useCasesSheetName" className="text-right text-sm">
                    Sheet Name
                  </label>
                  <Input
                    id="useCasesSheetName"
                    value={useCasesSheetName}
                    onChange={(e) => setUseCasesSheetName(e.target.value)}
                    placeholder="Use Case Metadata"
                    className="col-span-3"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This sheet should contain columns for id, title, description, category, etc.
                </p>
              </TabsContent>
              
              <TabsContent value="targetLevels" className="mt-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="targetLevelsSheetName" className="text-right text-sm">
                    Sheet Name
                  </label>
                  <Input
                    id="targetLevelsSheetName"
                    value={targetLevelsSheetName}
                    onChange={(e) => setTargetLevelsSheetName(e.target.value)}
                    placeholder="Target Automation Level"
                    className="col-span-3"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This sheet should contain columns for use case id, channel, and automation level.
                </p>
              </TabsContent>
              
              <TabsContent value="reportingData" className="mt-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="reportingDataSheetName" className="text-right text-sm">
                    Sheet Name
                  </label>
                  <Input
                    id="reportingDataSheetName"
                    value={reportingDataSheetName}
                    onChange={(e) => setReportingDataSheetName(e.target.value)}
                    placeholder="Use Case Reporting"
                    className="col-span-3"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This sheet should contain reporting data such as revenue impact, time periods, etc.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={isLoading}>
            {isLoading ? 'Importing...' : 'Import Data'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SheetImporter;
