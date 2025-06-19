'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { VisitorCard } from '@/components/visitor-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Visitor } from '@/types';
import { apiClient } from '@/lib/api';
import { Users, Search, Filter, Clock, CheckCircle, TrendingUp, Activity } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'signed-out'>('all');

  useEffect(() => {
    loadVisitors();
  }, []);

  const loadVisitors = async () => {
    setLoading(true);
    const result = await apiClient.getVisitors();
    if (result.success && result.data) {
      setVisitors(result.data);
    } else {
      toast.error('Failed to load visitors');
    }
    setLoading(false);
  };

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = 
      visitor.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.purpose_of_visit.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && !visitor.time_out) ||
      (statusFilter === 'signed-out' && visitor.time_out);

    return matchesSearch && matchesStatus;
  });

  const activeVisitors = visitors.filter(v => !v.time_out).length;
  const signedOutVisitors = visitors.filter(v => v.time_out).length;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading visitors...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Navigation />
      
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Visitor Logbook</h1>
        <p className="text-gray-600 text-lg">Track and manage all visitors in real-time</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Visitors</CardTitle>
            <div className="p-2 bg-white/20 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{visitors.length}</div>
            <p className="text-xs text-blue-100 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              All time visitors
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Currently Active</CardTitle>
            <div className="p-2 bg-white/20 rounded-lg">
              <Activity className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{activeVisitors}</div>
            <p className="text-xs text-green-100 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Signed in visitors
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Signed Out</CardTitle>
            <div className="p-2 bg-white/20 rounded-lg">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{signedOutVisitors}</div>
            <p className="text-xs text-gray-100 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Completed visits
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900">Filter & Search Visitors</h3>
              <p className="text-sm text-gray-600 font-normal">Find specific visitors or filter by status</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 focus:border-purple-500 focus:ring-purple-200 transition-all duration-200"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-48 focus:border-purple-500 focus:ring-purple-200 transition-all duration-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Visitors</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="signed-out">Signed Out Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Visitors List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Visitors ({filteredVisitors.length})
          </h2>
          {filteredVisitors.length > 0 && (
            <div className="flex gap-2">
              <Badge variant="default" className="text-sm bg-green-100 text-green-800 border-green-200">
                <Activity className="h-3 w-3 mr-1" />
                {filteredVisitors.filter(v => !v.time_out).length} Active
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <CheckCircle className="h-3 w-3 mr-1" />
                {filteredVisitors.filter(v => v.time_out).length} Signed Out
              </Badge>
            </div>
          )}
        </div>

        {filteredVisitors.length === 0 ? (
          <Card className="p-12 text-center shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <div className="p-4 bg-gray-50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Users className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No matching visitors found' : 'No visitors yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Visitors will appear here once they sign in'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Badge variant="outline" className="text-sm">
                Ready to welcome your first visitor
              </Badge>
            )}
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredVisitors.map((visitor) => (
              <VisitorCard key={visitor.id} visitor={visitor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}