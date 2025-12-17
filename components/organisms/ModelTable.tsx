'use client';

import { Button } from '@/components/ui/button';
import { Image } from '@/components/atoms/Image';

export interface TableModel {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  height?: string;
  featured?: boolean;
}

export interface ModelTableProps {
  models: TableModel[];
  onEdit?: (modelId: string) => void;
  onDelete?: (modelId: string) => void;
  className?: string;
}

export function ModelTable({ models, onEdit, onDelete, className = '' }: ModelTableProps) {
  if (models.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No models found</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Height</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {models.map((model) => (
            <tr key={model.id} className="hover:bg-gray-50 transition-colors">
              {/* 이미지 */}
              <td className="px-6 py-4">
                <div className="relative w-12 h-16 rounded overflow-hidden">
                  <Image src={model.imageUrl} alt={model.name} fill className="object-cover" />
                </div>
              </td>

              {/* 이름 */}
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{model.name}</div>
              </td>

              {/* 카테고리 */}
              <td className="px-6 py-4">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  {model.category}
                </span>
              </td>

              {/* 키 */}
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600">{model.height || '-'}</div>
              </td>

              {/* Featured */}
              <td className="px-6 py-4">
                {model.featured ? (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Featured
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-right space-x-2">
                {onEdit && (
                  <Button variant="outline" size="sm" onClick={() => onEdit(model.id)}>
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button variant="destructive" size="sm" onClick={() => onDelete(model.id)}>
                    Delete
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
