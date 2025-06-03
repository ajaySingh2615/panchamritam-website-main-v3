import { useState, useCallback } from 'react';
import { footerConfig } from '../config';

export const useNewsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [error, setError] = useState('');

  const validateEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const resetState = useCallback(() => {
    setEmail('');
    setError('');
    setSubscriptionStatus('');
  }, []);

  const clearMessages = useCallback(() => {
    setTimeout(() => {
      setSubscriptionStatus('');
      setError('');
    }, footerConfig.newsletter.successMessageDuration);
  }, []);

  const handleEmailChange = useCallback((e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  }, [error]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Reset previous states
    setError('');
    setSubscriptionStatus('');
    
    // Validation
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubscribing(true);
    
    try {
      // Simulate API call with delay
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate occasional API failures for realistic error handling
          if (Math.random() > 0.9) {
            reject(new Error('Network error. Please try again.'));
          } else {
            resolve();
          }
        }, footerConfig.newsletter.apiDelay);
      });
      
      // Success
      setSubscriptionStatus('success');
      setEmail('');
      clearMessages();
      
    } catch (apiError) {
      setError(apiError.message || 'Something went wrong. Please try again.');
      clearMessages();
    } finally {
      setIsSubscribing(false);
    }
  }, [email, validateEmail, clearMessages]);

  const getStatusMessage = useCallback(() => {
    if (subscriptionStatus === 'success') {
      return {
        type: 'success',
        icon: 'fas fa-check-circle',
        text: 'Successfully subscribed! Welcome to our community 🎉',
        className: 'text-green-300'
      };
    }
    
    if (error) {
      return {
        type: 'error',
        icon: 'fas fa-exclamation-triangle',
        text: error,
        className: 'text-red-300'
      };
    }
    
    return null;
  }, [subscriptionStatus, error]);

  return {
    // State
    email,
    isSubscribing,
    subscriptionStatus,
    error,
    
    // Actions
    handleEmailChange,
    handleSubmit,
    resetState,
    
    // Computed
    statusMessage: getStatusMessage(),
    isValid: email.trim() && validateEmail(email),
    
    // Utils
    validateEmail
  };
}; 