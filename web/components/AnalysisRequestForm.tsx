'use client';

import React, { useState } from 'react';

// AnalysisRequestFormの状態型定義
interface FormData {
  channelId: string;
  startDate: string;
  endDate: string;
}

// バリデーションエラー型定義
interface ValidationErrors {
  channelId?: string;
}

const AnalysisRequestForm: React.FC = () => {
  // フォーム状態管理
  const [formData, setFormData] = useState<FormData>({
    channelId: '',
    startDate: '',
    endDate: '',
  });

  // バリデーションエラー状態
  const [errors, setErrors] = useState<ValidationErrors>({});

  // 送信中状態
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 入力値変更ハンドラー
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // エラーをクリア
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // バリデーション関数
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // チャンネルIDの必須チェック
    if (!formData.channelId.trim()) {
      newErrors.channelId = 'Discord チャンネルIDは必須です';
    } else if (!/^[0-9]+$/.test(formData.channelId.trim())) {
      newErrors.channelId = 'チャンネルIDは数字のみで入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // フォーム送信ハンドラー（非同期）
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // バリデーションチェック
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: 後続のIssueで実装予定のSupabase Function (Mastraエージェント呼び出しAPI) を呼び出し
      // 現在はスタブとしてコンソール出力のみ
      console.log('分析リクエストデータ:', {
        channelId: formData.channelId.trim(),
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        timestamp: new Date().toISOString(),
      });

      // 送信成功のシミュレーション
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('分析リクエストを送信しました。（現在は開発中のため、コンソールログのみ出力されます）');

      // フォームリセット
      setFormData({
        channelId: '',
        startDate: '',
        endDate: '',
      });
    } catch (error) {
      console.error('分析リクエストの送信に失敗しました:', error);
      alert('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Discord 会話分析リクエスト
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Discord チャンネルID */}
        <div>
          <label 
            htmlFor="channelId" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Discord チャンネルID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="channelId"
            name="channelId"
            value={formData.channelId}
            onChange={handleInputChange}
            placeholder="例: 1234567890123456789"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.channelId ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.channelId && (
            <p className="text-red-500 text-sm mt-1">{errors.channelId}</p>
          )}
        </div>

        {/* 分析開始日 */}
        <div>
          <label 
            htmlFor="startDate" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            分析開始日（任意）
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>

        {/* 分析終了日 */}
        <div>
          <label 
            htmlFor="endDate" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            分析終了日（任意）
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>

        {/* 送信ボタン */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            } text-white focus:outline-none`}
          >
            {isSubmitting ? '送信中...' : '分析実行'}
          </button>
        </div>
      </form>

      {/* 注意事項 */}
      <div className="mt-6 p-3 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-600">
          <strong>注意:</strong> チャンネルIDは Discord の開発者モードで取得できます。
          日付を指定しない場合は、全期間のメッセージが分析対象となります。
        </p>
      </div>
    </div>
  );
};

export default AnalysisRequestForm;