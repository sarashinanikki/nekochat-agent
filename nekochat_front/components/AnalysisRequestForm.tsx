'use client';

import { useState } from 'react';

interface FormData {
  channelId: string;
  startDate: string;
  endDate: string;
}

interface FormErrors {
  channelId?: string;
}

export default function AnalysisRequestForm() {
  const [formData, setFormData] = useState<FormData>({
    channelId: '',
    startDate: '',
    endDate: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Channel ID validation
    if (!formData.channelId.trim()) {
      newErrors.channelId = 'Discord チャンネル ID は必須です';
    } else if (!/^\d+$/.test(formData.channelId.trim())) {
      newErrors.channelId = 'チャンネル ID は数字のみで入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Stub implementation - log form data to console
      console.log('分析リクエストデータ:', {
        channelId: formData.channelId.trim(),
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      });

      // TODO: Replace with actual API call to Supabase Function
      // const response = await fetch('/api/analysis', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      alert('分析リクエストを送信しました（コンソールを確認してください）');
    } catch (error) {
      console.error('送信エラー:', error);
      alert('送信中にエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Discord 分析リクエスト
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Channel ID Field */}
        <div>
          <label htmlFor="channelId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Discord チャンネル ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="channelId"
            name="channelId"
            value={formData.channelId}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.channelId 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="例: 123456789012345678"
          />
          {errors.channelId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.channelId}
            </p>
          )}
        </div>

        {/* Start Date Field */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            分析開始日 (任意)
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* End Date Field */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            分析終了日 (任意)
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSubmitting ? '送信中...' : '分析実行'}
        </button>
      </form>
    </div>
  );
}