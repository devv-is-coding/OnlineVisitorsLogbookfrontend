'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Visitor } from '@/types';
import { User, Clock, Phone, Target, Edit, Trash2, LogOut, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface VisitorCardProps {
  visitor: Visitor;
  isAdmin?: boolean;
  onTimeout?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function VisitorCard({ visitor, isAdmin = false, onTimeout, onDelete }: VisitorCardProps) {
  const isTimedOut = visitor.time_out !== null;
  
  // Get sex from Laravel relationship or fallback to direct field
  const visitorSex = visitor.sexes?.[0]?.sex || visitor.sex;
  
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/90 backdrop-blur-sm overflow-hidden group">
      <div className={`h-1 w-full ${isTimedOut ? 'bg-gray-400' : 'bg-gradient-to-r from-green-400 to-blue-500'}`} />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${isTimedOut ? 'bg-gray-100' : 'bg-blue-50'}`}>
              <User className={`h-5 w-5 ${isTimedOut ? 'text-gray-500' : 'text-blue-600'}`} />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900 mb-1">
                {visitor.firstname} {visitor.middlename && `${visitor.middlename} `}{visitor.lastname}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {visitorSex}, {visitor.age} years old
                </span>
                <Badge 
                  variant={isTimedOut ? "secondary" : "default"}
                  className={`${
                    isTimedOut 
                      ? 'bg-gray-100 text-gray-700' 
                      : 'bg-green-100 text-green-800 border-green-200'
                  }`}
                >
                  {isTimedOut ? (
                    <>
                      <LogOut className="h-3 w-3 mr-1" />
                      Signed Out
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      Active
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>
          
          {!isAdmin && (
            <Button asChild variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Link href={`/edit-visitor/${visitor.id}`}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 text-sm">
          <div className="p-1.5 bg-blue-50 rounded-md">
            <Phone className="h-4 w-4 text-blue-600" />
          </div>
          <span className="font-medium">{visitor.contact_number}</span>
        </div>
        
        <div className="flex items-start gap-3 text-sm">
          <div className="p-1.5 bg-purple-50 rounded-md mt-0.5">
            <Target className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">Purpose of Visit</p>
            <p className="text-gray-600 leading-relaxed">{visitor.purpose_of_visit}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-gray-500 pt-2 border-t border-gray-100">
          <div className="p-1.5 bg-green-50 rounded-md">
            <Calendar className="h-4 w-4 text-green-600" />
          </div>
          <span>
            Signed in: {format(new Date(visitor.created_at), 'MMM dd, yyyy h:mm a')}
          </span>
        </div>
        
        {isTimedOut && (
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="p-1.5 bg-red-50 rounded-md">
              <LogOut className="h-4 w-4 text-red-600" />
            </div>
            <span>
              Signed out: {format(new Date(visitor.time_out!), 'MMM dd, yyyy h:mm a')}
            </span>
          </div>
        )}
        
        {isAdmin && (
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            {!isTimedOut && (
              <Button
                onClick={() => onTimeout?.(visitor.id)}
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            )}
            <Button
              onClick={() => onDelete?.(visitor.id)}
              variant="destructive"
              size="sm"
              className="gap-2 bg-red-500 hover:bg-red-600 transition-all duration-200"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}