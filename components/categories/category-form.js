'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Upload, Image as ImageIcon } from 'lucide-react';

export default function CategoryForm({ category = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    image: category?.image || '',
    icon: category?.icon || '',
    display_order: category?.display_order || 0,
    is_active: category?.is_active ?? true
  });

  // Auto-generate slug from name
  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: category ? formData.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/upload/category-images', {
        method: 'POST',
        body: formDataUpload
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const { url } = await response.json();
      
      setFormData(prev => ({
        ...prev,
        image: url
      }));

      e.target.value = '';
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = category ? `/api/categories/${category.id}` : '/api/categories';
      const method = category ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/categories');
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={handleNameChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., Chafing Dishes & Warmers"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., chafing-dishes"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL-friendly identifier (lowercase, hyphens only)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Brief description of this category"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon (Emoji)
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., 🍲"
              maxLength={2}
            />
            <p className="text-xs text-gray-500 mt-1">
              Single emoji to represent this category
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Category Image
            </label>
            
            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 transition-colors mb-3">
              <input
                type="file"
                id="category-image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
              <label
                htmlFor="category-image-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <div className="p-2 bg-orange-50 rounded-full">
                  {uploadingImage ? (
                    <div className="animate-spin h-5 w-5 border-2 border-orange-600 border-t-transparent rounded-full" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-orange-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {uploadingImage ? 'Uploading...' : 'Upload Image from Device'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Click to select image
                  </p>
                </div>
              </label>
            </div>

            {/* Manual URL Input */}
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Or paste image URL manually"
            />
            
            {/* Image Preview */}
            {formData.image && (
              <div className="mt-3">
                <img 
                  src={formData.image} 
                  alt="Category preview"
                  className="w-32 h-32 object-cover rounded-lg"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Lower numbers appear first
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-gray-700">Active (visible to customers)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {loading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  );
}
