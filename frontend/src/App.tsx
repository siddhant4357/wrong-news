import { useState } from 'react'
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast'

function App() {
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const analyzeArticle = async () => {
    if (!text && !url) {
      toast.error('Please enter either text or URL')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post('http://localhost:8000/api/analyze', {
        text: text || undefined,
        url: url || undefined,
      })
      setResult(response.data)
    } catch (error) {
      toast.error('Error analyzing article')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Toaster position="top-right" />
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
                  Wrong News Detector
                </h1>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Article Text
                    </label>
                    <textarea
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      rows={4}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Paste article text here..."
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Article URL
                    </label>
                    <input
                      type="url"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Enter article URL..."
                    />
                  </div>
                  <button
                    onClick={analyzeArticle}
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? 'Analyzing...' : 'Analyze Article'}
                  </button>
                </div>
              </div>
              {result && (
                <div className="pt-6 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className={`p-4 rounded-lg ${
                    result.summary.is_fake ? 'bg-red-50' : 'bg-green-50'
                  }`}>
                    <h2 className="text-xl font-semibold mb-2">
                      Analysis Result
                    </h2>
                    <p className="text-gray-700">{result.summary.details}</p>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Confidence: {(result.summary.confidence * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App 