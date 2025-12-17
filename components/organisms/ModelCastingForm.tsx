'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface ModelCastingFormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  projectType: string;
  projectDate: string;
  budget: string;
  requirements: string;
}

export interface ModelCastingFormProps {
  onSubmit?: (data: ModelCastingFormData) => Promise<void> | void;
  isSubmitting?: boolean;
}

const PROJECT_TYPES = [
  { value: 'fashion', label: 'Fashion Show' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'editorial', label: 'Editorial' },
  { value: 'campaign', label: 'Campaign' },
  { value: 'other', label: 'Other' },
];

export function ModelCastingForm({ onSubmit, isSubmitting = false }: ModelCastingFormProps) {
  const [formData, setFormData] = useState<ModelCastingFormData>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    projectType: '',
    projectDate: '',
    budget: '',
    requirements: '',
  });

  const handleChange = (field: keyof ModelCastingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit?.(formData);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">CASTING INQUIRY</h2>
          <p className="text-gray-600 text-lg">Request our models for your project</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm space-y-6">
          {/* 회사명 */}
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              type="text"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              required
              placeholder="Enter your company name"
            />
          </div>

          {/* 담당자명 */}
          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person *</Label>
            <Input
              id="contactPerson"
              type="text"
              value={formData.contactPerson}
              onChange={(e) => handleChange('contactPerson', e.target.value)}
              required
              placeholder="Enter contact person name"
            />
          </div>

          {/* 이메일 */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>

          {/* 전화번호 */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
              placeholder="010-1234-5678"
            />
          </div>

          {/* 프로젝트 타입 */}
          <div className="space-y-2">
            <Label htmlFor="projectType">Project Type *</Label>
            <Select value={formData.projectType} onValueChange={(value) => handleChange('projectType', value)} required>
              <SelectTrigger id="projectType">
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 프로젝트 날짜 */}
          <div className="space-y-2">
            <Label htmlFor="projectDate">Project Date *</Label>
            <Input
              id="projectDate"
              type="date"
              value={formData.projectDate}
              onChange={(e) => handleChange('projectDate', e.target.value)}
              required
            />
          </div>

          {/* 예산 */}
          <div className="space-y-2">
            <Label htmlFor="budget">Budget</Label>
            <Input
              id="budget"
              type="text"
              value={formData.budget}
              onChange={(e) => handleChange('budget', e.target.value)}
              placeholder="Enter budget range (optional)"
            />
          </div>

          {/* 요구사항 */}
          <div className="space-y-2">
            <Label htmlFor="requirements">Project Requirements *</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => handleChange('requirements', e.target.value)}
              required
              rows={6}
              placeholder="Describe your project requirements, number of models needed, specific criteria, etc."
            />
          </div>

          {/* 제출 버튼 */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
          </Button>
        </form>
      </div>
    </section>
  );
}
