import AnalysisRequestForm from "../components/AnalysisRequestForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            NekoChat Agent
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discord 会話分析プラットフォーム
          </p>
        </div>
        
        <div className="flex justify-center">
          <AnalysisRequestForm />
        </div>
      </div>
    </div>
  );
}
