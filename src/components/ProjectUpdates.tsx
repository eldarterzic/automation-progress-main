
import React, { useState } from 'react';
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

const mockUpdates: ProjectUpdate[] = [
  {
    id: '1',
    date: '2024-06-15',
    title: 'New Investment Planning Use Case Deployed',
    content: 'The steering group approved the launch of our Investment Planning automation. This solution is expected to reduce planning cycles by 65% and improve accuracy by 30%.',
    source: 'Steering Group',
    type: 'Launch',
    isNew: true
  },
  {
    id: '2',
    date: '2024-06-10',
    title: 'May Results: 22% Increase in Automation Revenue',
    content: 'Monthly committee review shows our automation portfolio delivered €125,000 in May, a 22% increase over April. The Customer Retention module is performing particularly well.',
    source: 'Committee',
    type: 'Result',
    isNew: true
  },
  {
    id: '3',
    date: '2024-06-08',
    title: 'Risk Flag: Reporting Module Delay',
    content: 'The weekly standup identified a delay in the Reporting module deployment. Integration with legacy systems is taking longer than expected. New ETA is July 15, two weeks behind schedule.',
    source: 'Weekly Standup',
    type: 'Flag',
    isNew: true
  },
  {
    id: '4',
    date: '2024-06-01',
    title: 'Customer Journey Mapping Automation Live',
    content: 'Successfully deployed the Customer Journey Mapping use case across all channels. Early metrics show a 45% reduction in mapping time and improved customer insight generation.',
    source: 'Committee',
    type: 'Launch'
  },
  {
    id: '5',
    date: '2024-05-25',
    title: 'April Results Exceed Targets',
    content: 'April financial review confirms automation portfolio results are 15% above target. The Email Marketing Optimization use case contributed most significantly to this outcome.',
    source: 'Steering Group',
    type: 'Result'
  },
  {
    id: '6',
    date: '2024-05-18',
    title: 'Resource Allocation Adjustment',
    content: 'The steering group has approved reallocation of resources to accelerate the AI/ML integration project. Two additional developers will join starting June 1st.',
    source: 'Steering Group',
    type: 'General'
  },
  {
    id: '7',
    date: '2024-05-10',
    title: 'Google Analytics Integration Complete',
    content: 'The weekly standup confirmed successful completion of the Google Analytics integration. This enhancement will provide real-time performance data for all customer-facing automation use cases.',
    source: 'Weekly Standup',
    type: 'Launch'
  }
];

const ProjectUpdates = () => {
  const [filter, setFilter] = useState<UpdateType | 'All'>('All');
  
  const filteredUpdates = filter === 'All' 
    ? mockUpdates 
    : mockUpdates.filter(update => update.type === filter);

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
                  <span>{new Date(update.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</span>
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
