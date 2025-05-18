import React from 'react';

const AboutUs = () => {
  const teamMembers = [
    {
      name: 'Musa ITANGISHATSE',
      role: 'Project Director',
      image: '/uploads/pic.jpg',
      description: 'Leading our initiative with over 15 years of public service experience.',
      contact: 'john.doe@ces.gov.rw'
    },
    {
      name: 'SOLAIMAN',
      role: 'Community Relations Manager',
      image: '/uploads/pic.jpg',
      description: 'Dedicated to ensuring effective communication between citizens and agencies.',
      contact: 'sarah.mutesi@ces.gov.rw'
    },
    {
      name: 'Haruna Niyonkuru',
      role: 'Technical Lead',
      image: '/uploads/pic.jpg',
      description: 'Overseeing the technical infrastructure of our engagement platform.',
      contact: 'james.karemera@ces.gov.rw'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      {/* Mission Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Citizen Engagement System</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We are dedicated to bridging the gap between citizens and government agencies,
          creating a more responsive and efficient public service system in Rwanda.
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Our Vision</h2>
          <p className="text-gray-700">
            To create a transparent, efficient, and responsive governance system where every
            citizen's voice is heard and acted upon, fostering a stronger community through
            active engagement and collaboration.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Our Mission</h2>
          <p className="text-gray-700">
            To provide a user-friendly platform that enables citizens to submit and track their
            complaints while ensuring government agencies can efficiently address and resolve
            community issues.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Leadership Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600 mb-4">{member.description}</p>
                <a
                  href={`mailto:${member.contact}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
          <div className="text-gray-600">Complaints Resolved</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="text-4xl font-bold text-green-600 mb-2">15+</div>
          <div className="text-gray-600">Partner Agencies</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
          <div className="text-gray-600">Support Available</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
          <div className="text-gray-600">Satisfaction Rate</div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;