export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Welcome to VocaBuddy</h1>
        <p className="text-xl mt-4">Your personal vocabulary learning assistant</p>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            Learn
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Start learning new words with AI-powered assistance.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            Practice
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Review your vocabulary through various exercises.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            Track
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Monitor your progress and achievements.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            Connect
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Join the community and share your progress.
          </p>
        </div>
      </div>
    </main>
  );
}
