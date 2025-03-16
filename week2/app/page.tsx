import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          Welcome to AI Joke Generator
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 mt-4">
          Get ready to laugh with our AI-powered joke generator! Create
          customized jokes on any topic, with different styles and tones. Our AI
          ensures the jokes are both funny and appropriate.
        </p>

        <div className="mt-8">
          <Link
            href="/generate"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105"
          >
            Start Generating Jokes
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Powered by advanced AI technology to create unique and entertaining
          jokes just for you.
        </div>
      </div>
    </main>
  );
}
