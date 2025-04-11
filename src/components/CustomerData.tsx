
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Clock, Database, Users, Settings } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const CustomerData = () => {
  // Mock data for customer data systems status
  const systemStatuses = [
    { 
      name: 'Booking System', 
      status: 'operational', 
      lastSync: '2 hours ago', 
      recordCount: '1.2M',
      availability: '99.8%'
    },
    { 
      name: 'Club Viking', 
      status: 'operational', 
      lastSync: '30 minutes ago', 
      recordCount: '850K',
      availability: '99.9%'
    },
    { 
      name: 'Onboard Services', 
      status: 'warning', 
      lastSync: '1 day ago', 
      recordCount: '3.1M',
      availability: '97.5%'
    },
    { 
      name: 'Marketing Platform', 
      status: 'operational', 
      lastSync: '3 hours ago', 
      recordCount: '5.2M',
      availability: '99.6%'
    },
    { 
      name: 'Customer Feedback', 
      status: 'down', 
      lastSync: '3 days ago', 
      recordCount: '780K',
      availability: '89.2%'
    }
  ];

  // Updated data categories to exactly match the image
  const dataCategories = [
    {
      name: 'Identity',
      percentage: 99,
      color: 'bg-emerald-500',
      items: [
        { name: 'Customer ID', description: 'Unique identifier for each customer', percentage: 100, color: 'bg-emerald-500' },
        { name: 'Full Name', description: "Customer's full name", percentage: 98, color: 'bg-emerald-500' }
      ]
    },
    {
      name: 'Contact',
      percentage: 65,
      color: 'bg-amber-500',
      items: [
        { name: 'Email Address', description: 'Primary email address', percentage: 87, color: 'bg-emerald-500' },
        { name: 'Phone Number', description: 'Primary phone contact', percentage: 62, color: 'bg-amber-500' },
        { name: 'Mailing Address', description: 'Physical mailing address', percentage: 45, color: 'bg-amber-500' }
      ]
    },
    {
      name: 'Preferences',
      percentage: 33,
      color: 'bg-red-500',
      items: [
        { name: 'Cabin Class', description: "Preferred cabin class", percentage: 38, color: 'bg-red-500' },
        { name: 'Dining Preferences', description: "Food and dining preferences", percentage: 41, color: 'bg-amber-500' },
        { name: 'Special Requests', description: "Special accommodations", percentage: 29, color: 'bg-red-500' },
        { name: 'Loyalty Benefits', description: 'Preferred loyalty rewards', percentage: 22, color: 'bg-red-500' }
      ]
    },
    {
      name: 'Voyage',
      percentage: 69,
      color: 'bg-amber-500',
      items: [
        { name: 'Past Voyages', description: 'History of previous sailings', percentage: 75, color: 'bg-emerald-500' },
        { name: 'Favorite Destinations', description: 'Most frequently visited ports', percentage: 68, color: 'bg-amber-500' },
        { name: 'Onboard Activities', description: 'Preferred onboard experiences', percentage: 65, color: 'bg-amber-500' }
      ]
    }
  ];

  // Overview stats
  const overviewStats = [
    { 
      title: 'Overall Data Completeness', 
      value: '57%', 
      description: '', 
      percentage: 57, 
      icon: <Users className="h-6 w-6 text-blue-500" />,
      color: 'bg-amber-500'
    },
    { 
      title: 'Customer Profiles', 
      value: '5,412', 
      description: '+12.5%', 
      icon: <Users className="h-6 w-6 text-violet-500" />,
      trendLine: true
    },
    { 
      title: 'Data points in Profile', 
      value: '20', 
      description: 'Last updated today', 
      icon: <Database className="h-6 w-6 text-emerald-500" />
    },
    { 
      title: 'Consented database', 
      value: '68%', 
      description: '', 
      percentage: 68, 
      icon: <CheckCircle className="h-6 w-6 text-amber-500" />,
      color: 'bg-amber-500'
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'down':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'warning':
        return 'Warning';
      case 'down':
        return 'Down';
      default:
        return 'Unknown';
    }
  };

  // Calculate overall system health
  const operationalCount = systemStatuses.filter(system => system.status === 'operational').length;
  const totalSystems = systemStatuses.length;
  const healthPercentage = Math.round((operationalCount / totalSystems) * 100);

  return (
    <div className="space-y-8">
      {/* Systems Status */}
      <Card className="border-none shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">Systems Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-lg">Systems Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{healthPercentage}%</span>
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    healthPercentage > 90 ? 'bg-green-100' : 
                    healthPercentage > 75 ? 'bg-amber-100' : 'bg-red-100'
                  }`}>
                    {
                      healthPercentage > 90 ? 
                      <CheckCircle className="h-6 w-6 text-green-500" /> : 
                      <AlertCircle className={`h-6 w-6 ${healthPercentage > 75 ? 'text-amber-500' : 'text-red-500'}`} />
                    }
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {operationalCount} of {totalSystems} systems operational
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-lg">Total Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">11.1M</span>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Database className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Across all systems
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-lg">Last Full Sync</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">12h</span>
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Time since last complete sync
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-lg">Server Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">Active</span>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Settings className="h-6 w-6 text-green-500" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  All servers operational
                </p>
              </CardContent>
            </Card>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>System</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Synced</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Availability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {systemStatuses.map((system) => (
                <TableRow key={system.name}>
                  <TableCell className="font-medium">{system.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(system.status)}
                      <span>{getStatusText(system.status)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{system.lastSync}</TableCell>
                  <TableCell>{system.recordCount}</TableCell>
                  <TableCell>{system.availability}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Data Overview */}
      <Card className="border-none shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">Customer Data Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {overviewStats.map((stat, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2 pt-4">
                  <div className="flex items-center gap-2">
                    {stat.icon}
                    <CardTitle className="text-md">{stat.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{stat.value}</span>
                  </div>
                  {stat.percentage !== undefined && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${stat.color} h-2 rounded-full`}
                          style={{ width: `${stat.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {stat.trendLine && (
                    <div className="mt-2 h-10">
                      <svg className="w-full h-full" viewBox="0 0 100 20">
                        <path
                          d="M0,10 L10,8 L20,12 L30,10 L40,7 L50,9 L60,6 L70,8 L80,4 L90,7 L100,2"
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  )}
                  {stat.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Data Categories - updated to match the image styling */}
      <Card className="border-none shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">Customer Data Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">{category.name}</h3>
                  <span className="text-lg font-semibold text-gray-800">{category.percentage}%</span>
                </div>
                
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6">
                  <div
                    className={`${category.color} h-2.5 rounded-full`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                
                <div className="space-y-6">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="space-y-1.5">
                      <div className="flex flex-col">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          <span className="font-medium text-gray-800">{item.percentage}%</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-1.5">{item.description}</p>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerData;
