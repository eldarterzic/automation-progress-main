import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, LineChart, XAxis, YAxis, Tooltip, Bar, Line, ResponsiveContainer, Cell, Legend, ReferenceLine, LegendType } from 'recharts';
import { ArrowUpRight, HelpCircle, Clock, DollarSign, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { UseCase } from '@/types/use-case';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ReportingData } from '@/utils/googleSheets';


interface DashboardProps {
  useCases: UseCase[];
  reportingData?: ReportingData[];
}

const Dashboard: React.FC<DashboardProps> = ({ useCases, reportingData = [] }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [monthlyReach, setMonthlyReach] = useState<number>(0);
  const [useCaseList, setUseCaseList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    const fetchMonthlyReach = async () => {
      setLoading(true); // Set loading to true before the API call
      try {
        const response = await fetch('https://automation-progress-main.vercel.app:3000/api/fetchMonthlyReach');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const totalReach = data.slice(1).reduce((acc, row) => acc + parseInt(row[5], 10), 0);
        setMonthlyReach(totalReach);
      } catch (error) {
        console.error('Error fetching Monthly Reach data:', error.message);
      } finally {
        setLoading(false); // Set loading to false after the API call
      }
    };

    fetchMonthlyReach();
  }, []);

  useEffect(() => {
    const fetchUsecaseList = async () => {
      setLoading(true); // Set loading to true before the API call
      try {
        const response = await fetch('https://automation-progress-main.vercel.app:3000/api/fetchMonthlyReach');
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
  
        // Assuming the Google Sheet contains rows where the second column (index 1) has the use case names
        const usecaseList = data.slice(1).map((row) => row[1]); // Extract the second column as the use case list
        console.log('Usecase List:', usecaseList);
  
        setUseCaseList(usecaseList); // Set the useCaseList state with the array of items
      } catch (error) {
        console.error('Error fetching Use Case List:', error.message);
      } finally {
        setLoading(false); // Set loading to false after the API call
      }
    };
  
    fetchUsecaseList();
  }, []);
  
  // Calculate average current and target levels
  const avgCurrentLevel = useCases.reduce((acc, useCase) => acc + useCase.currentLevel, 0) / (useCases.length || 1);
  const avgTargetLevel = useCases.reduce((acc, useCase) => acc + (useCase.targetLevel || 0), 0) / (useCases.length || 1);
  
  // Use reporting data from props if available, otherwise use calculated data
  const portfolioImpactData = useMemo(() => {
    // If we have reporting data, use it
    if (reportingData && reportingData.length > 0) {
      // Group by year
      const dataByYear: Record<string, any> = {};
      
      reportingData.forEach(item => {
        if (item.year) {
          if (!dataByYear[item.year]) {
            dataByYear[item.year] = { 
              year: item.year, 
              investment: 0,
              cumulativeNetBenefit: 0
            };
          }
          
          // Add impact by development year if available
          if (item.useCaseId) {
            const useCase = useCases.find(uc => uc.id === item.useCaseId);
            if (useCase?.developmentYear) {
              const impactKey = `impact${useCase.developmentYear}`;
              dataByYear[item.year][impactKey] = (dataByYear[item.year][impactKey] || 0) + (item.impact || 0);
            }
          }
          
          // Add investment
          if (item.investment) {
            dataByYear[item.year].investment += item.investment;
          }
        }
      });
      
      // Convert to array and sort by year
      let result = Object.values(dataByYear).sort((a, b) => a.year.localeCompare(b.year));
      
      // Calculate cumulative net benefit
      let cumulativeBenefit = 0;
      result = result.map(year => {
        // Sum all impact values
        const totalImpact = Object.keys(year)
          .filter(key => key.startsWith('impact'))
          .reduce((sum, key) => sum + (year[key] || 0), 0);
        
        cumulativeBenefit += totalImpact - year.investment;
        return {
          ...year,
          cumulativeNetBenefit: cumulativeBenefit
        };
      });
      
      return result;
    }
    
    // If no reporting data, generate sample data as before
    const years = useCases.reduce((acc, useCase) => {
      if (useCase.developmentYear && !acc.includes(useCase.developmentYear)) {
        acc.push(useCase.developmentYear);
      }
      return acc;
    }, [] as number[]).sort();
    
    // Generate year range from earliest to latest + 1 (for future projection)
    const yearRange = years.length > 0 
      ? Array.from({ length: (Math.max(...years) + 1) - Math.min(...years) + 1 }, 
          (_, i) => Math.min(...years) + i)
      : [2023, 2024, 2025, 2026]; // Default years if no data
    
    // Calculate impact values for each year
    return yearRange.map(year => {
      const result: Record<string, any> = { year: year.toString() };
      
      // Base revenue impact for each year's use cases
      const baseValue = 300; // Base value for revenue impact
      const multiplier = 1.2; // Growth multiplier for subsequent years
      
      // Calculate cumulative investment (background)
      result.investment = year * 75;
      
      // Calculate revenue impact for each development year
      years.forEach(devYear => {
        if (devYear <= year) {
          // Number of use cases from this development year
          const useCasesCount = useCases.filter(uc => uc.developmentYear === devYear).length;
          
          // Revenue impact grows with years in production
          const yearsInProduction = year - devYear;
          const revenueImpact = useCasesCount * baseValue * Math.pow(multiplier, yearsInProduction);
          
          result[`impact${devYear}`] = revenueImpact;
        } else {
          result[`impact${devYear}`] = 0;
        }
      });
      
      // Calculate cumulative net benefit
      const totalRevenue = years.reduce((total, devYear) => 
        devYear <= year ? total + result[`impact${devYear}`] : total, 0);
      result.cumulativeNetBenefit = totalRevenue - result.investment;
      
      return result;
    });
  }, [useCases, reportingData]);
  
  // Use revenue data from reporting if available
  const monthlyRevenueData = useMemo(() => {
    if (reportingData && reportingData.length > 0) {
      const revenueByMonth: Record<string, number> = {};
      
      // Filter for revenue data that has month information
      reportingData
        .filter(item => item.month && item.revenue)
        .forEach(item => {
          if (item.month && item.revenue) {
            // Use month or construct key from year and month
            const monthKey = item.month;
            revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + item.revenue;
          }
        });
      
      // Convert to array format needed for the chart
      return Object.entries(revenueByMonth)
        .map(([month, revenue]) => ({ month, revenue }))
        .sort((a, b) => {
          // Sort months (if they're named Jan, Feb, etc.)
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return months.indexOf(a.month) - months.indexOf(b.month);
        });
    }
    
    // If no reporting data, use the default sample data
    return [
      { month: 'Jan', revenue: 85000 },
      { month: 'Feb', revenue: 92000 },
      { month: 'Mar', revenue: 98500 },
      { month: 'Apr', revenue: 103000 },
      { month: 'May', revenue: 110000 },
      { month: 'Jun', revenue: 115000 },
      { month: 'Jul', revenue: 118000 },
      { month: 'Aug', revenue: 120000 },
      { month: 'Sep', revenue: 122000 },
      { month: 'Oct', revenue: 125000 },
      { month: 'Nov', revenue: 127500 },
      { month: 'Dec', revenue: 130000 },
    ];
  }, [reportingData]);
  
  // Count use cases by level
  const levelCounts = Array(6).fill(0);
  useCases.forEach(useCase => {
    levelCounts[useCase.currentLevel]++;
  });
  
  const levelData = levelCounts.map((count, index) => ({
    level: `Level ${index}`,
    count,
    color: getLevelColor(index),
  }));
  
  // Prepare data for category chart
  const categoryData = Object.entries(
    useCases.reduce((acc, useCase) => {
      if (!acc[useCase.category]) {
        acc[useCase.category] = { total: 0, avg: 0 };
      }
      acc[useCase.category].total++;
      acc[useCase.category].avg += useCase.currentLevel;
      return acc;
    }, {} as Record<string, { total: number; avg: number }>)
  ).map(([category, data]) => ({
    category,
    count: data.total,
    avgLevel: Number((data.avg / data.total).toFixed(1)),
  })).sort((a, b) => b.count - a.count);
  
  // Sample data for new metrics - could be calculated from reporting data
  const totalAutomationPortfolio = useCases.length;
  const averageTimeToDeployDays = 45; // Sample data
  
  // Calculate total monthly revenue from the most recent month data
  const totalMonthlyRevenue = monthlyRevenueData.length > 0 
    ? monthlyRevenueData[monthlyRevenueData.length - 1].revenue 
    : 125000;
  
  // Get unique development years for the impact chart legend
  const impactYears = useCases
    .map(useCase => useCase.developmentYear)
    .filter((value, index, self) => value !== undefined && self.indexOf(value) === index)
    .sort() as number[];
  
  // Fix the Legend type issue within the render section where it's used
  return (
    <section className="py-12 px-4 md:px-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Automation Dashboard</h2>
          <p className="text-gray-500 mt-2">Track and visualize your automation progress</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-1 text-blue-500" />
                Current Average
              </CardDescription>
              <CardTitle className="text-3xl">{avgCurrentLevel.toFixed(1)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">
                Average automation level across all use cases
              </div>
            </CardContent>
          </Card>
          
           {/* Monthly Reach Card */}
           <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center">
          Monthly Reach
        </CardDescription>
        <CardTitle className="text-3xl">
          {loading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-black"></div>
          ) : (
            monthlyReach.toLocaleString()
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-500">
          Total reach across all campaigns this month
        </div>
      </CardContent>
    </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                Target Average
              </CardDescription>
              <CardTitle className="text-3xl">{avgTargetLevel.toFixed(1)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-gray-500">
                <span className="text-green-500 mr-1">+{(avgTargetLevel - avgCurrentLevel).toFixed(1)}</span> 
                automation level improvement planned
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-amber-500" />
                Avg. Time to Deploy
              </CardDescription>
              <CardTitle className="text-3xl">{averageTimeToDeployDays}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">
                Average days to deploy a new automation
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-emerald-500" />
                Monthly Revenue
              </CardDescription>
              <CardTitle className="text-3xl">${(totalMonthlyRevenue / 1000).toFixed(1)}k</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">
                Total revenue generated by automation portfolio
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 sm:w-[500px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="byCategory">By Category</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Impact of use case portfolio over time</CardTitle>
                  <CardDescription>Revenue impact and investment by development year</CardDescription>
                </div>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[250px] text-sm">
                        This chart shows how the automation portfolio generates revenue over time, with stacked bars showing impact from each year's use cases and the yellow line showing cumulative net benefit.
                      </p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={portfolioImpactData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    >
                      <XAxis 
                        dataKey="year" 
                        padding={{ left: 10, right: 10 }}
                      />
                      <YAxis yAxisId="left" orientation="left" />
                      <Tooltip 
                        cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border border-gray-100 shadow-md rounded-md">
                                <p className="text-sm font-medium mb-1">{label}</p>
                                <div className="space-y-1">
                                  {payload
                                    .filter(p => p.dataKey !== 'investment' && p.dataKey !== 'cumulativeNetBenefit' && Number(p.value) > 0)
                                    .map((entry, index) => {
                                      const year = String(entry.dataKey).replace('impact', '');
                                      return (
                                        <div key={index} className="flex justify-between items-center gap-2">
                                          <div className="flex items-center">
                                            <div 
                                              className="w-3 h-3 rounded-full mr-2" 
                                              style={{ backgroundColor: getYearColor(parseInt(year, 10)) }}
                                            ></div>
                                            <span className="text-xs text-gray-600">
                                              Revenue impact: {year} use cases:
                                            </span>
                                          </div>
                                          <span className="text-xs font-medium">
                                            {typeof entry.value === 'number' ? entry.value.toFixed(0) : entry.value}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  <div className="flex justify-between items-center gap-2">
                                    <div className="flex items-center">
                                      <div className="w-3 h-3 rounded-full mr-2 bg-gray-200"></div>
                                      <span className="text-xs text-gray-600">
                                        Total investment:
                                      </span>
                                    </div>
                                    <span className="text-xs font-medium">
                                      {payload.find(p => p.dataKey === 'investment')?.value}
                                    </span>
                                  </div>
                                  <div className="mt-1 pt-1 border-t border-gray-100">
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full mr-2 bg-yellow-400"></div>
                                        <span className="text-xs font-medium text-gray-800">Cumulative Net Benefit:</span>
                                      </div>
                                      <span className="text-xs font-bold">
                                        {typeof payload.find(p => p.dataKey === 'cumulativeNetBenefit')?.value === 'number' 
                                          ? (payload.find(p => p.dataKey === 'cumulativeNetBenefit')?.value as number).toFixed(0) 
                                          : payload.find(p => p.dataKey === 'cumulativeNetBenefit')?.value}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      
                      <Legend 
                        verticalAlign="bottom" 
                        wrapperStyle={{ paddingTop: "10px" }}
                        payload={[
                          ...impactYears.map(year => ({
                            value: `Revenue impact: ${year} use cases`,
                            type: 'square' as LegendType,
                            color: getYearColor(year)
                          })),
                          {
                            value: 'Total investment',
                            type: 'square' as LegendType,
                            color: '#e5e7eb' // light gray
                          },
                          {
                            value: 'Cumulative Net Benefit',
                            type: 'line' as LegendType,
                            color: '#facc15' // yellow
                          }
                        ]}
                      />
                      
                      {/* Background investment bars */}
                      <Bar dataKey="investment" stackId="background" fill="#e5e7eb" yAxisId="left" />
                      
                      {/* Impact bars stacked on top */}
                      {impactYears.map((year, index) => (
                        <Bar 
                          key={year} 
                          dataKey={`impact${year}`} 
                          stackId="impact" 
                          fill={getYearColor(year)} 
                          yAxisId="left"
                        />
                      ))}
                      
                      {/* Cumulative net benefit line */}
                      <Line 
                        type="monotone" 
                        dataKey="cumulativeNetBenefit" 
                        stroke="#facc15" 
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        dot={{ fill: '#facc15', r: 5 }}
                        yAxisId="left"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="byCategory" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Category Analysis</CardTitle>
                <CardDescription>Automation levels by business category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {categoryData.map((category, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{category.category}</h3>
                        <span className="text-sm text-gray-500">{category.count} use cases</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-100 h-2 rounded-full">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(category.avgLevel / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium min-w-[40px] text-right">
                          {category.avgLevel}/5
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="revenue" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Automation Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue generated by automation portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      revenue: { color: "#0ea5e9" }
                    }}
                  >
                    <LineChart
                      data={monthlyRevenueData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <XAxis
                        dataKey="month"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value / 1000}k`}
                      />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Month
                                    </span>
                                    <span className="font-bold text-muted-foreground">
                                      {payload[0].payload.month}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Revenue
                                    </span>
                                    <span className="font-bold text-muted-foreground">
                                      ${payload[0].value?.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        strokeWidth={2}
                        activeDot={{
                          r: 6,
                          style: { fill: "#0ea5e9", opacity: 0.25 },
                        }}
                        style={{
                          stroke: "var(--color-revenue)",
                        }}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </section>
  );
};

// Helper function to get color based on level
function getLevelColor(level: number): string {
  switch (level) {
    case 0: return 'bg-gray-400';
    case 1: return 'bg-blue-400';
    case 2: return 'bg-green-400';
    case 3: return 'bg-yellow-400';
    case 4: return 'bg-purple-400';
    case 5: return 'bg-red-400';
    default: return 'bg-gray-400';
  }
}

// Helper function for level descriptions
function getLevelDescription(level: number): string {
  const descriptions = [
    "Manual: Entirely human-operated process with no automation",
    "Assisted: Basic tools support the manual process",
    "Partial: Key parts of the process are automated",
    "Conditional: Automation with human supervision",
    "Supervised: Mostly automated with minimal human intervention",
    "Autonomous: Fully automated end-to-end process"
  ];
  
  return descriptions[level] || "Unknown level";
}

// Helper function to get color based on development year
function getYearColor(year: number): string {
  const yearColors: Record<number, string> = {
    2023: '#3f3d6b', // Dark blue-purple (matches image)
    2024: '#c7c9e5', // Light lavender (matches image)
    2025: '#336166', // Teal-green (matches image)
    2026: '#5d8b90', // Light teal (additional color)
    2027: '#7a9ba0', // Very light teal (additional color)
  };
  
  return yearColors[year] || '#888888'; // Default gray
}

export default Dashboard;
