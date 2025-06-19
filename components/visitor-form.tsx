'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateVisitorData, UpdateVisitorData, Visitor } from '@/types';
import { Loader2, Save, UserPlus, User, Phone, Target, Calendar, Users } from 'lucide-react';
import { toast } from 'sonner';

const visitorSchema = z.object({
  firstname: z.string().min(1, 'First name is required').max(255, 'First name too long'),
  middlename: z.string().max(255, 'Middle name too long').optional(),
  lastname: z.string().min(1, 'Last name is required').max(255, 'Last name too long'),
  age: z.number().min(1, 'Age must be at least 1').max(150, 'Age must be realistic'),
  sex: z.enum(['Male', 'Female'], { required_error: 'Please select a gender' }),
  contact_number: z.string().min(1, 'Contact number is required'),
  purpose_of_visit: z.string().min(1, 'Purpose of visit is required').max(500, 'Purpose too long'),
});

type VisitorFormData = z.infer<typeof visitorSchema>;

interface VisitorFormProps {
  initialData?: Visitor;
  onSubmit: (data: CreateVisitorData | UpdateVisitorData) => Promise<void>;
  isLoading?: boolean;
  title: string;
  submitText: string;
}

export function VisitorForm({ 
  initialData, 
  onSubmit, 
  isLoading = false, 
  title, 
  submitText 
}: VisitorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<VisitorFormData>({
    resolver: zodResolver(visitorSchema),
    defaultValues: {
      firstname: initialData?.firstname || '',
      middlename: initialData?.middlename || '',
      lastname: initialData?.lastname || '',
      age: initialData?.age || 18,
      sex: initialData?.sex || undefined,
      contact_number: initialData?.contact_number || '',
      purpose_of_visit: initialData?.purpose_of_visit || '',
    },
  });

  const selectedSex = watch('sex');

  const handleFormSubmit = async (data: VisitorFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <CardTitle className="text-xl flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
            {initialData ? <Save className="h-5 w-5 text-white" /> : <UserPlus className="h-5 w-5 text-white" />}
          </div>
          <div>
            <h2 className="text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 font-normal">
              {initialData ? 'Update your information below' : 'Please fill in all required fields'}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname" className="text-sm font-medium text-gray-700">
                  First Name *
                </Label>
                <Input
                  id="firstname"
                  {...register('firstname')}
                  placeholder="Enter first name"
                  className={`transition-all duration-200 ${
                    errors.firstname 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'focus:border-blue-500 focus:ring-blue-200'
                  }`}
                />
                {errors.firstname && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.firstname.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="middlename" className="text-sm font-medium text-gray-700">
                  Middle Name
                </Label>
                <Input
                  id="middlename"
                  {...register('middlename')}
                  placeholder="Enter middle name (optional)"
                  className="focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
                />
                {errors.middlename && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.middlename.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastname" className="text-sm font-medium text-gray-700">
                Last Name *
              </Label>
              <Input
                id="lastname"
                {...register('lastname')}
                placeholder="Enter last name"
                className={`transition-all duration-200 ${
                  errors.lastname 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
              {errors.lastname && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.lastname.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Gender *</Label>
                <Select
                  value={selectedSex}
                  onValueChange={(value: 'Male' | 'Female') => setValue('sex', value)}
                >
                  <SelectTrigger className={`transition-all duration-200 ${
                    errors.sex 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'focus:border-blue-500 focus:ring-blue-200'
                  }`}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Male
                      </div>
                    </SelectItem>
                    <SelectItem value="Female">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Female
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.sex && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.sex.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                  Age *
                </Label>
                <Input
                  id="age"
                  type="number"
                  {...register('age', { valueAsNumber: true })}
                  placeholder="Enter age"
                  className={`transition-all duration-200 ${
                    errors.age 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'focus:border-blue-500 focus:ring-blue-200'
                  }`}
                />
                {errors.age && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.age.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact_number" className="text-sm font-medium text-gray-700">
                Contact Number *
              </Label>
              <Input
                id="contact_number"
                {...register('contact_number')}
                placeholder="Enter contact number"
                className={`transition-all duration-200 ${
                  errors.contact_number 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
              {errors.contact_number && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.contact_number.message}
                </p>
              )}
            </div>
          </div>

          {/* Visit Information Section */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Visit Information</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purpose_of_visit" className="text-sm font-medium text-gray-700">
                Purpose of Visit *
              </Label>
              <Textarea
                id="purpose_of_visit"
                {...register('purpose_of_visit')}
                placeholder="Describe the purpose of your visit"
                rows={4}
                className={`transition-all duration-200 resize-none ${
                  errors.purpose_of_visit 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'focus:border-blue-500 focus:ring-blue-200'
                }`}
              />
              {errors.purpose_of_visit && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.purpose_of_visit.message}
                </p>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200" 
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {initialData ? <Save className="mr-2 h-5 w-5" /> : <UserPlus className="mr-2 h-5 w-5" />}
                {submitText}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}