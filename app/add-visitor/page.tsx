'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { VisitorForm } from '@/components/visitor-form';
import { CreateVisitorData } from '@/types';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

export default function AddVisitor() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: CreateVisitorData) => {
    setIsLoading(true);
    try {
      const result = await apiClient.createVisitor(data);
      
      if (result.success) {
        toast.success('Visitor registered successfully!');
        router.push('/');
      } else {
        toast.error(result.message || 'Failed to register visitor');
        
        // Display validation errors
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            messages.forEach((message) => {
              toast.error(`${field}: ${message}`);
            });
          });
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Navigation />
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Register as Visitor</h1>
        <p className="text-gray-600">Please fill in the form below to sign in</p>
      </div>

      <VisitorForm
        title="Add New Visitor"
        submitText="Register Visitor"
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}