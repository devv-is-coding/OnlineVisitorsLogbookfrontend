'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { VisitorCard } from '@/components/visitor-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Visitor, Admin } from '@/types';
import { apiClient } from '@/lib/api';
import { Users, Search, Filter, Clock, CheckCircle, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPanel() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'signed-out'>('all');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    const result = await apiClient.getAdminPanel();
    if (result.success && result.data) {
      setVisitors(result.data.visitors);
      setAdmins(result.data.admins);
    } else {
      toast.error('Failed to load admin data');
    }
    setLoading(false);
  };

  const handleTimeout = async (id: number) => {
    const result = await apiClient.timeoutVisitor(id);
    if (result.success) {
      toast.success('Visitor signed out successfully');
      await loadAdminData(); // Reload data
    } else {
      toast.error('Failed to sign out visitor');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this visitor? This action cannot be undone.')) {
      return;
    }

    const result = await apiClient.deleteVisitor(id);
    if (result.success) {
      toast.success('Visitor deleted successfully');
      await loadAdminData(); // Reload data
    } else {
      toast.error('Failed to delete visitor');
    }
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
        <Navigation isAdmin />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Navigation isAdmin />
      
      {/* Admin Alert */}
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Admin Panel:</strong> You have administrative privileges to manage visitors.
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visitors.length}</div>
            <p className="text-xs text-blue-100">All time visitors</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Active</CardTitle>
            <Clock className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVisitors}</div>
            <p className="text-xs text-green-100">Signed in visitors</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signed Out</CardTitle>
            <CheckCircle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{signedOutVisitors}</div>
            <p className="text-xs text-gray-100">Completed visits</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Shield className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admins.length}</div>
            <p className="text-xs text-purple-100">System admins</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Search Visitors
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
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-48">
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Manage Visitors ({filteredVisitors.length})
          </h2>
          {filteredVisitors.length > 0 && (
            <div className="flex gap-2">
              <Badge variant="default" className="text-sm">
                {filteredVisitors.filter(v => !v.time_out).length} Active
              </Badge>
              <Badge variant="secondary" className="text-sm">
                {filteredVisitors.filter(v => v.time_out).length} Signed Out
              </Badge>
            </div>
          )}
        </div>

        {activeVisitors > 0 && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              There are <strong>{activeVisitors}</strong> active visitors currently signed in.
            </AlertDescription>
          </Alert>
        )}

        {filteredVisitors.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No matching visitors found' : 'No visitors yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Visitors will appear here once they sign in'
              }
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredVisitors.map((visitor) => (
              <VisitorCard 
                key={visitor.id} 
                visitor={visitor} 
                isAdmin
                onTimeout={handleTimeout}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}