import React from 'react';
import { Link } from 'react-router-dom';

const ContactMessages = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Contact Messages</h1>
        <p className="text-gray-600 mt-2">Contact form management has been updated.</p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-center">
          <div className="text-center max-w-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-800">Contact Form System Updated</h2>
            <p className="mt-2 text-gray-600">
              The contact form system has been simplified. Messages are now sent directly to your admin email ({process.env.ADMIN_EMAIL || 'configured admin email'}).
            </p>
            <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Benefits of the new system:
                  </p>
                  <ul className="mt-2 text-sm text-green-700 list-disc list-inside">
                    <li>Contact form submissions are sent directly to your email</li>
                    <li>You can reply directly from your email client</li>
                    <li>No need to log into the admin dashboard to check messages</li>
                    <li>Automatic confirmation emails are sent to customers</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Link 
                to="/admin/dashboard" 
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
              >
                <span>Return to Dashboard</span>
              </Link>
            </div>
          </div>
          </div>
        </div>
    </div>
  );
};

export default ContactMessages; 