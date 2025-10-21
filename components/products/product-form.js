'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Plus, Trash2, Upload, Image as ImageIcon, Video } from 'lucide-react';

export default function ProductForm({ product = null, categories = [] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [formData, setFormData] = useState({
    id: product?.id || '',
    name: product?.name || '',
    category_id: product?.category_id || '',
    description: product?.description || '',
    long_description: product?.long_description || '',
    images: product?.images || [],
    videos: product?.videos || [],
    is_available: product?.is_available ?? true,
    is_featured: product?.is_featured ?? false,
    stock_quantity: product?.stock_quantity || null,
    display_order: product?.display_order || 0
  });

  const [imageInput, setImageInput] = useState('');
  const [videoInput, setVideoInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = product ? `/api/products/${product.id}` : '/api/products';
      const method = product ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/products');
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageInput.trim()]
      });
      setImageInput('');
    }
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const addVideo = () => {
    if (videoInput.trim()) {
      setFormData({
        ...formData,
        videos: [...formData.videos, videoInput.trim()]
      });
      setVideoInput('');
    }
  };

  const removeVideo = (index) => {
    setFormData({
      ...formData,
      videos: formData.videos.filter((_, i) => i !== index)
    });
  };

  // Handle file upload for images
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const response = await fetch('/api/upload/images', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      const { urls } = await response.json();
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...urls]
      }));

      // Reset file input
      e.target.value = '';
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  // Handle file upload for videos
  const handleVideoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingVideos(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const response = await fetch('/api/upload/videos', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload videos');
      }

      const { urls } = await response.json();
      
      setFormData(prev => ({
        ...prev,
        videos: [...prev.videos, ...urls]
      }));

      // Reset file input
      e.target.value = '';
    } catch (error) {
      console.error('Error uploading videos:', error);
      alert('Failed to upload videos. Please try again.');
    } finally {
      setUploadingVideos(false);
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
              Product ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              disabled={!!product}
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
              placeholder="e.g., chafing-001"
            />
            <p className="text-xs text-gray-500 mt-1">
              Unique identifier (lowercase, hyphens allowed)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., Chafing Dish"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Brief description for listings"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Long Description
            </label>
            <textarea
              rows={4}
              value={formData.long_description}
              onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Detailed description for product page"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
        
        <div className="space-y-4">
          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImages}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <div className="p-3 bg-orange-50 rounded-full">
                {uploadingImages ? (
                  <div className="animate-spin h-6 w-6 border-2 border-orange-600 border-t-transparent rounded-full" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-orange-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {uploadingImages ? 'Uploading...' : 'Upload Images from Device'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Click to select images (JPG, PNG, GIF, WebP)
                </p>
              </div>
            </label>
          </div>

          {/* Manual URL Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Or paste image URL manually"
            />
            <button
              type="button"
              onClick={addImage}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {formData.images.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Added Images ({formData.images.length})</p>
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <img 
                    src={image} 
                    alt={`Preview ${index + 1}`}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                  <span className="flex-1 text-sm text-gray-700 truncate">{image}</span>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Videos */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Videos</h2>
        
        <div className="space-y-4">
          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
            <input
              type="file"
              id="video-upload"
              multiple
              accept="video/*"
              onChange={handleVideoUpload}
              disabled={uploadingVideos}
              className="hidden"
            />
            <label
              htmlFor="video-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <div className="p-3 bg-orange-50 rounded-full">
                {uploadingVideos ? (
                  <div className="animate-spin h-6 w-6 border-2 border-orange-600 border-t-transparent rounded-full" />
                ) : (
                  <Video className="h-6 w-6 text-orange-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {uploadingVideos ? 'Uploading...' : 'Upload Videos from Device'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Click to select videos (MP4, WebM, MOV)
                </p>
              </div>
            </label>
          </div>

          {/* Manual URL Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVideo())}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Or paste video URL manually"
            />
            <button
              type="button"
              onClick={addVideo}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {formData.videos.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Added Videos ({formData.videos.length})</p>
              {formData.videos.map((video, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <Video className="w-12 h-12 text-gray-400" />
                  <span className="flex-1 text-sm text-gray-700 truncate">{video}</span>
                  <button
                    type="button"
                    onClick={() => removeVideo(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                value={formData.stock_quantity || ''}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Optional"
              />
            </div>

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
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-gray-700">Available for rent</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-gray-700">Featured product</span>
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
          {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
