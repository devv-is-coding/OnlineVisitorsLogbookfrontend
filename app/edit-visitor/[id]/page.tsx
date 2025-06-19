"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { VisitorForm } from "@/components/visitor-form";
import { UpdateVisitorData, Visitor, Sex } from "@/types";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

export default function EditVisitor() {
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [sexes, setSexes] = useState<Sex[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVisitor, setIsLoadingVisitor] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  useEffect(() => {
    if (id) {
      loadVisitor();
    }
  }, [id]);

  const loadVisitor = async () => {
    setIsLoadingVisitor(true);
    try {
      const result = await apiClient.getVisitor(id);
      if (result.success && result.data) {
        // Type check: does data have a 'visitor' key?
        if ("visitor" in result.data) {
          const data = result.data as { visitor: Visitor; sexes: Sex[] };
          setVisitor(data.visitor);
          setSexes(data.sexes || []);
        } else {
          // Assume it's a plain Visitor object
          setVisitor(result.data as Visitor);
        }
      } else {
        toast.error("Visitor not found");
        router.push("/");
      }
    } catch (error) {
      toast.error("Failed to load visitor data");
      router.push("/");
    } finally {
      setIsLoadingVisitor(false);
    }
  };

  const handleSubmit = async (data: UpdateVisitorData) => {
    setIsLoading(true);
    try {
      const result = await apiClient.updateVisitor(id, data);

      if (result.success) {
        toast.success("Visitor information updated successfully!");
        router.push("/");
      } else {
        toast.error(result.message || "Failed to update visitor");

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
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingVisitor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading visitor information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!visitor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Navigation />
        <div className="text-center">
          <p className="text-gray-600">Visitor not found</p>
        </div>
      </div>
    );
  }

  // Convert Laravel visitor data to frontend format
  const visitorForForm = {
    ...visitor,
    sex: visitor.sexes?.[0]?.sex || visitor.sex || "Male",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Navigation />

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Edit Visitor Information
        </h1>
        <p className="text-gray-600">Update your visitor information below</p>
      </div>

      <VisitorForm
        initialData={visitorForForm}
        title="Edit Visitor Information"
        submitText="Update Information"
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
