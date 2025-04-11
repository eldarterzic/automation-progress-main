
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { UseCase } from '@/types/use-case';
import { useCases as initialUseCases } from '@/data/use-cases';
import Header from '@/components/Header';
import UseCaseList from '@/components/UseCaseList';
import Dashboard from '@/components/Dashboard';
import AutomationLevelMapper from '@/components/AutomationLevelMapper';
import AutomationMatrix from '@/components/AutomationMatrix';
import ProjectUpdates from '@/components/ProjectUpdates';
import CustomerData from '@/components/CustomerData';
import AdminPanel from '@/components/AdminPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportingData } from '@/utils/googleSheets';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Index = () => {
  const [useCases, setUseCases] = useState<UseCase[]>(initialUseCases);
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);
  const [mapperOpen, setMapperOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [useCaseActiveView, setUseCaseActiveView] = useState("list");
  const [reportingData, setReportingData] = useState<ReportingData[]>([]);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  
  // Load reporting data from localStorage if available
  useEffect(() => {
    const storedReportingData = localStorage.getItem('reportingData');
    if (storedReportingData) {
      try {
        setReportingData(JSON.parse(storedReportingData));
      } catch (error) {
        console.error('Failed to parse stored reporting data:', error);
      }
    }
  }, []);
  
  const handleOpenMapper = (useCase: UseCase) => {
    setSelectedUseCase(useCase);
    setMapperOpen(true);
  };
  
  const handleSaveMapping = (id: string, newLevel: number) => {
    setUseCases(prevUseCases => prevUseCases.map(useCase => useCase.id === id ? {
      ...useCase,
      currentLevel: newLevel
    } : useCase));
    toast({
      title: "Automation level updated",
      description: "The use case automation level has been successfully updated."
    });
  };
  
  const handleUpdateUseCases = (newUseCases: UseCase[]) => {
    setUseCases(newUseCases);
    toast({
      title: "Use cases updated",
      description: "The use case data has been successfully updated."
    });
  };

  const handleUpdateReportingData = (newData: ReportingData[]) => {
    setReportingData(newData);
    localStorage.setItem('reportingData', JSON.stringify(newData));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <AnimatePresence>
        <motion.main 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="min-h-screen"
        >
          <Header />
          
          <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
              <Tabs value={activeView} onValueChange={setActiveView} className="flex-1">
                <div className="flex justify-between items-center mb-4">
                  <TabsList className="max-w-md">
                    <TabsTrigger value="dashboard" className="flex-1">Dashboard</TabsTrigger>
                    <TabsTrigger value="useCases" className="flex-1">Use Case Portfolio</TabsTrigger>
                    <TabsTrigger value="updates" className="flex-1">Project Updates</TabsTrigger>
                    <TabsTrigger value="customerData" className="flex-1">Customer Data</TabsTrigger>
                  </TabsList>
                  
                  <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="ml-4 gap-2">
                        <Settings size={16} />
                        Admin
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Admin Panel</DialogTitle>
                        <DialogDescription>
                          Manage project settings and import data
                        </DialogDescription>
                      </DialogHeader>
                      <AdminPanel 
                        useCases={useCases}
                        onUpdateUseCases={handleUpdateUseCases}
                        onUpdateReportingData={handleUpdateReportingData}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              
                <TabsContent value="dashboard" className="mt-0">
                  <Dashboard useCases={useCases} reportingData={reportingData} />
                </TabsContent>
                
                <TabsContent value="useCases" className="mt-0">
                  <Tabs value={useCaseActiveView} onValueChange={setUseCaseActiveView}>
                    <TabsList className="mb-6">
                      <TabsTrigger value="list">List View</TabsTrigger>
                      <TabsTrigger value="matrix">Matrix View</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="list">
                      <UseCaseList onOpenMapper={handleOpenMapper} useCases={useCases} />
                    </TabsContent>
                    
                    <TabsContent value="matrix">
                      <AutomationMatrix useCases={useCases} />
                    </TabsContent>
                  </Tabs>
                </TabsContent>
                
                <TabsContent value="updates" className="mt-0">
                  <ProjectUpdates />
                </TabsContent>
                
                <TabsContent value="customerData" className="mt-0">
                  <CustomerData />
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {selectedUseCase && <AutomationLevelMapper useCase={selectedUseCase} open={mapperOpen} onOpenChange={setMapperOpen} onSave={handleSaveMapping} />}
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

export default Index;
