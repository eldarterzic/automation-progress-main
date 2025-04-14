
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SheetImporter from '@/components/SheetImporter';
import { UseCase } from '@/types/use-case';
import { ReportingData } from '@/utils/googleSheets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminPanelProps {
  useCases: UseCase[];
  onUpdateUseCases: (newUseCases: UseCase[]) => void;
  onUpdateReportingData: (newData: ReportingData[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  useCases, 
  onUpdateUseCases,
  onUpdateReportingData 
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const handleReportingDataUpdate = (data: ReportingData[]) => {
    onUpdateReportingData(data);
  };

  return (
    <div className="w-full">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Project Overview</TabsTrigger>
          <TabsTrigger value="import">Data Import</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Statistics</CardTitle>
              <CardDescription>
                Overview of the current project data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard 
                  title="Total Use Cases" 
                  value={useCases.length.toString()}
                  description="Number of use cases in the system" 
                />
                <StatsCard 
                  title="Categories" 
                  value={Array.from(new Set(useCases.map(uc => uc.category))).length.toString()}
                  description="Unique categories" 
                />
                <StatsCard 
                  title="In Production" 
                  value={useCases.filter(uc => uc.inProduction).length.toString()}
                  description="Use cases deployed to production" 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>
                Key details about the project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="border-b pb-2">
                <h3 className="font-medium">Project Name</h3>
                <p className="text-sm text-muted-foreground">Data Driven XXX XXX</p>
              </div>
              <div className="border-b pb-2">
                <h3 className="font-medium">Last Updated</h3>
                <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-medium">Data Sources</h3>
                <p className="text-sm text-muted-foreground">Google Sheets, Manual Entry</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="import" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Import Data from Google Sheets</CardTitle>
              <CardDescription>
                Import use case data, target automation levels, and reporting data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SheetImporter 
                useCases={useCases} 
                onUpdateUseCases={onUpdateUseCases} 
                onUpdateReportingData={handleReportingDataUpdate} 
                isStandalone={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper component for stats cards
interface StatsCardProps {
  title: string;
  value: string;
  description: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description }) => {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </div>
  );
};

export default AdminPanel;
