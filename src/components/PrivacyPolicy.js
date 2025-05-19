const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">Your privacy is important to us</p>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="text-gray-600 mb-4">We collect information that you provide directly to us when submitting complaints or creating an account. This includes:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Name and contact information</li>
              <li>Account credentials</li>
              <li>Complaint details and supporting documents</li>
              <li>Communication preferences</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">Your information is used to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Process and resolve your complaints</li>
              <li>Communicate updates about your complaints</li>
              <li>Improve our services and user experience</li>
              <li>Ensure the security of our platform</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-gray-600 mb-4">We implement appropriate security measures to protect your personal information, including:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Encryption of sensitive data</li>
              <li>Regular security assessments</li>
              <li>Secure data storage practices</li>
              <li>Access controls and authentication</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Access your personal information</li>
              <li>Request corrections to your data</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of communications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;