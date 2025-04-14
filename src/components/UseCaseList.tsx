import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, LayoutList, Filter } from 'lucide-react';
import { UseCase } from '@/types/use-case';
import UseCaseCard from './UseCaseCard';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

interface UseCaseListProps {
  onOpenMapper?: (useCase: UseCase) => void;
}

const channels = ["Email", "SMS", "Meta", "Google", "App", "Web", "Other"];
const developmentTimes = ["S", "M", "L"];

const UseCaseList = ({ onOpenMapper }: UseCaseListProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [filteredUseCases, setFilteredUseCases] = useState<UseCase[]>([]);
  const [filters, setFilters] = useState({
    production: "all", // "all", "yes", "no"
    channels: [] as string[],
    developmentTime: [] as string[]
  });

  // Fetch data from the API
  useEffect(() => {
    const fetchUseCases = async () => {
      try {
        const response = await fetch('https://node-api-service-pearl.vercel.app/api/fetchMonthlyReach'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Transform the API response into UseCase[]
        const mappedUseCases: UseCase[] = data.slice(1).map((row: string[]) => ({
          id: row[0],
          name: row[1],
          purpose: row[2],
          inProduction: row[3],
          businessUnit: row[4],
          monthlyReach: parseInt(row[5], 10) || 0,
          channelCosts: row[6] || undefined,
          timeToDevelop: parseInt(row[7], 10) || 0,
          timeToOptimize: row[8] ? parseInt(row[8], 10) : undefined,
        }));

        setUseCases(mappedUseCases); // Populate useCases with API data
        setFilteredUseCases(mappedUseCases); // Initialize filteredUseCases with the same data
        console.log('Fetched use cases:', mappedUseCases);
      } catch (error) {
        console.error('Error fetching use cases:', error.message);
      }
    };

    fetchUseCases();
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    let result = [...useCases];
    
    // Filter by production status
    if (filters.production !== "all") {
      const isInProduction = filters.production === "yes";
      result = result.filter(useCase => 
        (useCase.inProduction === (isInProduction ? "yes" : "no"))
      );
    }
    
    // Filter by channels
    if (filters.channels.length > 0) {
      result = result.filter(useCase => 
        useCase.channels?.some(channel => filters.channels.includes(channel))
      );
    }
    
    // Filter by development time
    if (filters.developmentTime.length > 0) {
      result = result.filter(useCase => 
        filters.developmentTime.includes(useCase.developmentTime || '')
      );
    }
    
    setFilteredUseCases(result);
  }, [useCases, filters]);

  const toggleChannel = (channel: string) => {
    setFilters(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const toggleDevelopmentTime = (time: string) => {
    setFilters(prev => ({
      ...prev,
      developmentTime: prev.developmentTime.includes(time)
        ? prev.developmentTime.filter(t => t !== time)
        : [...prev.developmentTime, time]
    }));
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Use Cases Developed</h1>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center h-10 rounded-md bg-white border border-input px-3 py-2 text-sm font-medium hover:bg-muted">
                <Filter className="h-4 w-4 mr-2" /> Filters
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">Production Status</p>
                  <Select
                    value={filters.production}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, production: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="yes">In Production</SelectItem>
                      <SelectItem value="no">Not in Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <DropdownMenuSeparator />
                
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">Channels</p>
                  <div className="space-y-2">
                    {channels.map(channel => (
                      <div key={channel} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`channel-${channel}`} 
                          checked={filters.channels.includes(channel)}
                          onCheckedChange={() => toggleChannel(channel)}
                        />
                        <label 
                          htmlFor={`channel-${channel}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {channel}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <DropdownMenuSeparator />
                
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">Development Time</p>
                  <div className="flex gap-2">
                    {developmentTimes.map(time => (
                      <button
                        key={time}
                        className={`px-3 py-1 text-sm rounded-md ${
                          filters.developmentTime.includes(time)
                            ? 'bg-[#003158] text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => toggleDevelopmentTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')}>
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <LayoutList className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "flex flex-col gap-4"
        }
      >
        {filteredUseCases.map((useCase, index) => (
          <UseCaseCard 
            key={useCase.id} 
            useCase={useCase} 
            view={viewMode}
            onSelect={() => onOpenMapper && onOpenMapper(useCase)}
            delay={index * 0.05}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default UseCaseList;
