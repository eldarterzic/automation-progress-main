import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, MessageSquare, Flag, Bell, TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react';

type UpdateSource = 'Committee' | 'Steering Group' | 'Weekly Standup';
type UpdateType = 'Launch' | 'Result' | 'Flag' | 'General';

interface ProjectUpdate {
  id: string;
  date: string;
  title: string;
  content: string;
  source: UpdateSource;
  type: UpdateType;
  isNew?: boolean;
}

const ProjectUpdates = () => {
  const [filter, setFilter] = useState<UpdateType | 'All'>('All');
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);

  // Fetch data from the API
  useEffect(() => {
    const fetchProjectUpdates = async () => {
      try {
        const response = await fetch('https://node-api-service-pearl.vercel.app/api/projectUpdates');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Parse the API response
        const parsedUpdates = parseUpdates(data);
        setUpdates(parsedUpdates);
      } catch (error) {
        console.error('Error fetching project updates:', error.message);
      }
    };

    fetchProjectUpdates();
  }, []);

  // Parse the API response
  const parseUpdates = (data: string[][]): ProjectUpdate[] => {
    return data.slice(1).map((row, index) => ({
      id: `${index + 1}`,
      title: row[0],
      source: row[1] as UpdateSource,
      date: row[2],
      content: row[3],
      type: row[4] as UpdateType,
      isNew: index < 3, // Mark the first 3 updates as "new" for demonstration
    }));
  };

  const filteredUpdates = filter === 'All' 
    ? updates 
    : updates.filter(update => update.type === filter);

  const getTypeIcon = (type: UpdateType) => {
    switch (type) {
      case 'Launch': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'Result': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'Flag': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'General': return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSourceIcon = (source: UpdateSource) => {
    switch (source) {
      case 'Committee': return <Bell className="h-4 w-4" />;
      case 'Steering Group': return <Flag className="h-4 w-4" />;
      case 'Weekly Standup': return <Calendar className="h-4 w-4" />;
    }
  };
  
  const getTypeColor = (type: UpdateType) => {
    switch (type) {
      case 'Launch': return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
      case 'Result': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'Flag': return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'General': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-6 space-y-6"
    >
      <div className="flex justify-between items-center px-4">
        <h2 className="text-2xl font-bold text-gray-900">Project Updates</h2>
        <div className="flex gap-2">
          <Badge 
            onClick={() => setFilter('All')} 
            className={`cursor-pointer ${filter === 'All' ? 'bg-vikingblue-700 hover:bg-vikingblue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            All
          </Badge>
          <Badge 
            onClick={() => setFilter('Launch')} 
            className={`cursor-pointer ${filter === 'Launch' ? 'bg-vikingblue-700 hover:bg-vikingblue-800' : getTypeColor('Launch')}`}
          >
            Launches
          </Badge>
          <Badge 
            onClick={() => setFilter('Result')} 
            className={`cursor-pointer ${filter === 'Result' ? 'bg-vikingblue-700 hover:bg-vikingblue-800' : getTypeColor('Result')}`}
          >
            Results
          </Badge>
          <Badge 
            onClick={() => setFilter('Flag')} 
            className={`cursor-pointer ${filter === 'Flag' ? 'bg-vikingblue-700 hover:bg-vikingblue-800' : getTypeColor('Flag')}`}
          >
            Flags
          </Badge>
        </div>
      </div>

      <ScrollArea className="h-[600px] rounded-md px-4">
        <div className="space-y-4 pb-4">
          {filteredUpdates.map((update) => (
            <Card key={update.id} className={`relative ${update.isNew ? 'border-l-4 border-l-vikingred-500' : ''}`}>
              {update.isNew && (
                <div className="absolute -left-2 top-4 bg-vikingred-500 text-white text-xs px-2 py-1 rounded">
                  New
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{update.title}</CardTitle>
                  <Badge variant="outline" className={getTypeColor(update.type)}>
                    <span className="flex items-center gap-1">
                      {getTypeIcon(update.type)}
                      {update.type}
                    </span>
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    {getSourceIcon(update.source)}
                    {update.source}
                  </span>
                  <span>•</span>
                  <span>{update.date}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{update.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default ProjectUpdates;
