'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export interface ModelFormData {
  name: string;
  slug: string;
  category: string;
  height: string;
  bust: string;
  waist: string;
  hip: string;
  shoeSize: string;
  hairColor: string;
  eyeColor: string;
  bio: string;
  featured: boolean;
}

export interface ModelFormProps {
  initialData?: Partial<ModelFormData>;
  onSubmit?: (data: ModelFormData) => Promise<void> | void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  mode?: 'create' | 'edit';
}

const CATEGORIES = [
  { value: 'INTOWN', label: 'In Town' },
  { value: 'DIRECT', label: 'Direct' },
  { value: 'ALL', label: 'All' },
];

const DEFAULT_FORM_DATA: ModelFormData = {
  name: '',
  slug: '',
  category: '',
  height: '',
  bust: '',
  waist: '',
  hip: '',
  shoeSize: '',
  hairColor: '',
  eyeColor: '',
  bio: '',
  featured: false,
};

export function ModelForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  mode = 'create',
}: ModelFormProps) {
  const [formData, setFormData] = useState<ModelFormData>({
    ...DEFAULT_FORM_DATA,
    ...initialData,
  });

  const handleChange = (field: keyof ModelFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold">{mode === 'create' ? 'Create Model' : 'Edit Model'}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 이름 */}
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            placeholder="Enter model name"
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            type="text"
            value={formData.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
            required
            placeholder="model-name"
          />
        </div>

        {/* 카테고리 */}
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => handleChange('category', value)} required>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 키 */}
        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => handleChange('height', e.target.value)}
            placeholder="175"
            min="150"
            max="220"
          />
        </div>

        {/* Bust */}
        <div className="space-y-2">
          <Label htmlFor="bust">Bust (cm)</Label>
          <Input
            id="bust"
            type="number"
            value={formData.bust}
            onChange={(e) => handleChange('bust', e.target.value)}
            placeholder="85"
          />
        </div>

        {/* Waist */}
        <div className="space-y-2">
          <Label htmlFor="waist">Waist (cm)</Label>
          <Input
            id="waist"
            type="number"
            value={formData.waist}
            onChange={(e) => handleChange('waist', e.target.value)}
            placeholder="60"
          />
        </div>

        {/* Hip */}
        <div className="space-y-2">
          <Label htmlFor="hip">Hip (cm)</Label>
          <Input
            id="hip"
            type="number"
            value={formData.hip}
            onChange={(e) => handleChange('hip', e.target.value)}
            placeholder="90"
          />
        </div>

        {/* Shoe Size */}
        <div className="space-y-2">
          <Label htmlFor="shoeSize">Shoe Size</Label>
          <Input
            id="shoeSize"
            type="text"
            value={formData.shoeSize}
            onChange={(e) => handleChange('shoeSize', e.target.value)}
            placeholder="250"
          />
        </div>

        {/* Hair Color */}
        <div className="space-y-2">
          <Label htmlFor="hairColor">Hair Color</Label>
          <Input
            id="hairColor"
            type="text"
            value={formData.hairColor}
            onChange={(e) => handleChange('hairColor', e.target.value)}
            placeholder="Black"
          />
        </div>

        {/* Eye Color */}
        <div className="space-y-2">
          <Label htmlFor="eyeColor">Eye Color</Label>
          <Input
            id="eyeColor"
            type="text"
            value={formData.eyeColor}
            onChange={(e) => handleChange('eyeColor', e.target.value)}
            placeholder="Brown"
          />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          rows={4}
          placeholder="Enter model biography"
        />
      </div>

      {/* Featured */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => handleChange('featured', checked === true)}
        />
        <Label htmlFor="featured" className="cursor-pointer">
          Featured Model
        </Label>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Model' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
