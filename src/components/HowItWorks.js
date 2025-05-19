const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h1>
          <p className="text-lg text-gray-600">Simple steps to submit and track your complaints</p>
        </div>

        <div className="space-y-12">
          <div className="bg-white rounded-lg shadow-lg p-8 transform transition duration-300 hover:scale-105">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-center mb-4">1. Submit Your Complaint</h2>
            <p className="text-gray-600 text-center">Fill out our user-friendly complaint form with detailed information about your issue. The more details you provide, the better we can assist you.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 transform transition duration-300 hover:scale-105">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-center mb-4">2. Track Progress</h2>
            <p className="text-gray-600 text-center">Use your unique tracking number to monitor the status of your complaint in real-time. Stay informed about every step of the resolution process.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 transform transition duration-300 hover:scale-105">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-center mb-4">3. Resolution</h2>
            <p className="text-gray-600 text-center">Receive timely updates as your complaint is processed and resolved by the relevant authorities. We ensure transparent communication throughout the process.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;