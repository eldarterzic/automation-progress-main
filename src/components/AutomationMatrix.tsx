import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from 'framer-motion';

const statusLevels = [
  { value: 0, label: "Not planned", color: "bg-transparent" },
  { value: 1, label: "Backlog", color: "bg-amber-200" },
  { value: 2, label: "On roadmap", color: "bg-amber-500" },
  { value: 3, label: "Deployed", color: "bg-green-500" },
];

const AutomationMatrix = () => {
  const [useCases, setUseCases] = useState([]);
  const [channels, setChannels] = useState([]);
  const [automationLevels, setAutomationLevels] = useState({});
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");

  // Fetch data from the API
  useEffect(() => {
    const fetchAutomationData = async () => {
      try {
        const response = await fetch('https://node-api-service-pearl.vercel.app/api/targetAutomationLevel');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Parse the API response
        const parsedData = parseAutomationData(data);
        setUseCases(parsedData.useCases);
        setChannels(parsedData.channels);
        setAutomationLevels(parsedData.automationLevels);
        setCategories(parsedData.categories);
        setActiveCategory(parsedData.categories[0] || "");
      } catch (error) {
        console.error("Error fetching automation data:", error.message);
      }
    };

    fetchAutomationData();
  }, []);

  // Parse the API response
  const parseAutomationData = (data): { useCases: any[]; channels: string[]; automationLevels: Record<string, any>; categories: string[] } => {
    const channels = data[2].slice(5, -2); // Extract channel names from the header row
    const useCases = [];
    const automationLevels = {};
    const categories: Set<string> = new Set();

    data.slice(3).forEach((row) => {
      if (!row[2] || !row[3]) return; // Skip rows without valid use case data

      const category = row[1] || "Uncategorized";
      categories.add(category);

      const useCase = {
        id: row[2],
        title: row[3],
        category,
      };

      useCases.push(useCase);

      // Extract automation levels for each channel
      const levels = {};
      channels.forEach((channel, index) => {
        const levelIndex = index + 5; // Channels start at column 5
        levels[channel] = row[levelIndex] === "TRUE" ? 3 : 0; // Map "TRUE" to 3 (Deployed), otherwise 0
      });

      automationLevels[useCase.id] = levels;
    });

    return {
      useCases,
      channels,
      automationLevels,
      categories: Array.from(categories),
    };
  };

  const toggleAutomationLevel = (useCaseId, channel) => {
    setAutomationLevels((prev) => {
      const currentLevels = prev[useCaseId] || {};
      const currentLevel = currentLevels[channel] || 0;

      // Cycle through status levels (0 -> 1 -> 2 -> 3 -> 0)
      const newLevel = (currentLevel + 1) % statusLevels.length;
      return {
        ...prev,
        [useCaseId]: {
          ...currentLevels,
          [channel]: newLevel,
        },
      };
    });
  };

  const getStatusColor = (level) => {
    return statusLevels.find((status) => status.value === level)?.color || "bg-transparent";
  };

  const getStatusLabel = (level) => {
    return statusLevels.find((status) => status.value === level)?.label || "Not planned";
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
          {statusLevels.map((status) => (
            <div key={status.value} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${status.color} border border-gray-300`}></div>
              <span className="text-sm">{status.label}</span>
            </div>
          ))}
        </div>

        {categories.length > 0 ? (
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="mb-6 bg-gray-100 p-1 rounded-lg">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-[300px] font-medium">Use Case</TableHead>
                        {channels.map((channel) => (
                          <TableHead key={channel} className="text-center font-medium">
                            {channel}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {useCases
                        .filter((useCase) => useCase.category === category)
                        .map((useCase) => (
                          <TableRow key={useCase.id}>
                            <TableCell className="font-medium">{useCase.title}</TableCell>
                            {channels.map((channel) => {
                              const statusLevel = automationLevels[useCase.id]?.[channel] || 0;
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
                                          <div
                                            className={`w-6 h-6 rounded ${statusColor} border border-gray-300`}
                                          ></div>
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
