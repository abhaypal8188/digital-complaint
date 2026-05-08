import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Upload, X, Loader2 } from 'lucide-react';

const RaiseComplaint = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Others',
    priority: 'Medium',
    location: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 3) {
      toast.error('You can upload a maximum of 3 images');
      return;
    }

    setImages([...images, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      images.forEach(image => data.append('images', image));

      await api.post('/complaints', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Complaint submitted successfully!');
      navigate('/dashboard/my-complaints');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Raise a Complaint</h1>
        <p className="text-slate-500 dark:text-slate-400">Fill out the form below to report an issue.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Brief summary of the issue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                {['Plumbing', 'Electricity', 'Cleaning', 'Internet', 'Security', 'Food', 'Others'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                {['Low', 'Medium', 'High', 'Urgent'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Location / Room Number</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="E.g., Room 402, Block A"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                placeholder="Provide detailed information about the issue..."
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Upload Images (Max 3)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-slate-400" />
                  <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload files</span>
                      <input type="file" className="sr-only" multiple accept="image/*" onChange={handleImageChange} disabled={images.length >= 3} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
              
              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="flex gap-4 mt-4 flex-wrap">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2 transition-colors"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaiseComplaint;
