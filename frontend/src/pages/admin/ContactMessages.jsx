import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getContactMessages, deleteContactMessage, updateContactMessageStatus, sendContactReply } from '../../services/adminAPI';
import { formatDistanceToNow, startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// Define message status constants
const MESSAGE_STATUS = {
  UNREAD: 'unread',
  READ: 'read',
  IN_PROGRESS: 'in_progress',
  REPLIED: 'replied',
  ARCHIVED: 'archived'
};

// Map status to display labels and colors
const STATUS_CONFIG = {
  [MESSAGE_STATUS.UNREAD]: { 
    label: 'Unread', 
    bgColor: 'bg-blue-100', 
    textColor: 'text-blue-800'
  },
  [MESSAGE_STATUS.READ]: { 
    label: 'Read', 
    bgColor: 'bg-green-100', 
    textColor: 'text-green-800'
  },
  [MESSAGE_STATUS.IN_PROGRESS]: { 
    label: 'In Progress', 
    bgColor: 'bg-yellow-100', 
    textColor: 'text-yellow-800'
  },
  [MESSAGE_STATUS.REPLIED]: { 
    label: 'Replied', 
    bgColor: 'bg-purple-100', 
    textColor: 'text-purple-800'
  },
  [MESSAGE_STATUS.ARCHIVED]: { 
    label: 'Archived', 
    bgColor: 'bg-gray-100', 
    textColor: 'text-gray-800'
  }
};

// Define date range presets
const DATE_RANGES = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  THIS_WEEK: 'this_week',
  LAST_WEEK: 'last_week',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  CUSTOM: 'custom'
};

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Date filtering states
  const [dateRangeType, setDateRangeType] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // State for email reply functionality
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyData, setReplyData] = useState({
    subject: '',
    message: '',
    includeOriginalMessage: true
  });
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyTemplates, setReplyTemplates] = useState([
    { 
      name: 'General Inquiry Response', 
      subject: 'RE: Your Inquiry to Panchamritam', 
      message: 'Thank you for reaching out to us. We have received your inquiry and a member of our team will review it shortly. We typically respond within 1-2 business days.\n\nBest regards,\nThe Panchamritam Team' 
    },
    { 
      name: 'Product Inquiry Response', 
      subject: 'RE: Your Product Question', 
      message: 'Thank you for your interest in our products. We appreciate your question and are happy to provide more information.\n\nPlease let me know if you need any further assistance.\n\nRegards,\nThe Panchamritam Team' 
    },
    { 
      name: 'Order Status Follow-up', 
      subject: 'RE: Your Order Status Inquiry', 
      message: 'Thank you for inquiring about your order status. I have checked our system and can provide you with an update.\n\nPlease let me know if you have any other questions about your order.\n\nBest regards,\nThe Panchamritam Team' 
    }
  ]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      // Build the request params
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm.trim() || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
      };
      
      // Add date range filters if set
      if (startDate) {
        params.startDate = startDate.toISOString();
      }
      
      if (endDate) {
        params.endDate = endDate.toISOString();
      }
      
      const response = await getContactMessages(params);
      
      setMessages(response.data.messages);
      setHasMore(response.pagination.hasMore);
    } catch (err) {
      console.error('Error fetching contact messages:', err);
      setError(err.message || 'Failed to fetch contact messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [currentPage, searchTerm, filterStatus, startDate, endDate]);

  // Set date range based on preset selection
  const handleDateRangeChange = (rangeType) => {
    setDateRangeType(rangeType);
    const now = new Date();
    
    switch (rangeType) {
      case DATE_RANGES.TODAY:
        setStartDate(startOfDay(now));
        setEndDate(endOfDay(now));
        break;
      
      case DATE_RANGES.YESTERDAY:
        const yesterday = subDays(now, 1);
        setStartDate(startOfDay(yesterday));
        setEndDate(endOfDay(yesterday));
        break;
      
      case DATE_RANGES.THIS_WEEK:
        setStartDate(startOfWeek(now, { weekStartsOn: 1 }));
        setEndDate(endOfWeek(now, { weekStartsOn: 1 }));
        break;
      
      case DATE_RANGES.LAST_WEEK:
        const lastWeekStart = subDays(startOfWeek(now, { weekStartsOn: 1 }), 7);
        const lastWeekEnd = subDays(endOfWeek(now, { weekStartsOn: 1 }), 7);
        setStartDate(lastWeekStart);
        setEndDate(lastWeekEnd);
        break;
      
      case DATE_RANGES.THIS_MONTH:
        setStartDate(startOfMonth(now));
        setEndDate(endOfMonth(now));
        break;
      
      case DATE_RANGES.LAST_MONTH:
        const lastMonth = subDays(startOfMonth(now), 1);
        setStartDate(startOfMonth(lastMonth));
        setEndDate(endOfMonth(lastMonth));
        break;
      
      case DATE_RANGES.CUSTOM:
        setShowDatePicker(true);
        break;
      
      default:
        // Reset date filter
        setStartDate(null);
        setEndDate(null);
        setShowDatePicker(false);
    }
  };

  // Handle custom date range selection
  const handleCustomDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    
    if (start && end) {
      // Close date picker when range is selected
      setShowDatePicker(false);
    }
  };

  // Clear all filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setDateRangeType('');
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
  };

  const resetSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    setShowModal(true);
    
    // If message is unread, automatically mark as read when opened
    if (message.status === MESSAGE_STATUS.UNREAD) {
      try {
        await updateMessageStatus(message.message_id, MESSAGE_STATUS.READ);
      } catch (err) {
        console.error('Error updating message status:', err);
      }
    }
  };

  const updateMessageStatus = async (messageId, newStatus) => {
    setIsUpdatingStatus(true);
    try {
      // Use real API call
      await updateContactMessageStatus(messageId, newStatus);
      
      // Update message in the list
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.message_id === messageId 
            ? { ...msg, status: newStatus } 
            : msg
        )
      );
      
      // Update selected message if open in modal
      if (selectedMessage && selectedMessage.message_id === messageId) {
        setSelectedMessage(prev => ({ ...prev, status: newStatus }));
      }
      
      return true;
    } catch (err) {
      console.error('Error updating message status:', err);
      setError(err.message || 'Failed to update message status');
      return false;
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const confirmDelete = (messageId) => {
    setDeleteId(messageId);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      // Use real API call
      await deleteContactMessage(deleteId);
      
      // Remove the deleted message from state
      setMessages(prevMessages => 
        prevMessages.filter(message => message.message_id !== deleteId)
      );
      
      // Reset state
      setDeleteId(null);
      
      // Close the modal if we deleted the selected message
      if (selectedMessage && selectedMessage.message_id === deleteId) {
        setShowModal(false);
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      setError(err.message || 'Failed to delete message');
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date to "X time ago" format
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Format date for display
  const formatDateDisplay = (date) => {
    return date ? format(date, 'MMM dd, yyyy') : '';
  };

  // Handle opening the reply modal
  const handleReply = (message) => {
    setReplyData({
      subject: `RE: ${message.subject || 'Your Message to Panchamritam'}`,
      message: '',
      includeOriginalMessage: true
    });
    setShowReplyModal(true);
  };

  // Apply a reply template
  const applyTemplate = (templateIndex) => {
    const template = replyTemplates[templateIndex];
    setReplyData(prev => ({
      ...prev,
      subject: template.subject,
      message: template.message
    }));
  };

  // Handle sending the reply
  const handleSendReply = async () => {
    if (!selectedMessage || !replyData.message.trim()) {
      return;
    }
    
    setIsSendingReply(true);
    
    try {
      // Prepare the full message with original message if selected
      let fullMessage = replyData.message;
      
      if (replyData.includeOriginalMessage) {
        fullMessage += '\n\n----------\nOriginal Message:\n----------\n';
        fullMessage += `From: ${selectedMessage.name} <${selectedMessage.email}>\n`;
        fullMessage += `Date: ${new Date(selectedMessage.submitted_at).toLocaleString()}\n`;
        fullMessage += `Subject: ${selectedMessage.subject || 'No Subject'}\n\n`;
        fullMessage += selectedMessage.message;
      }
      
      // Use real API call to send reply
      await sendContactReply(selectedMessage.message_id, {
        subject: replyData.subject,
        message: fullMessage,
        recipientEmail: selectedMessage.email,
        recipientName: selectedMessage.name
      });
      
      // Update message status to replied
      await updateMessageStatus(selectedMessage.message_id, MESSAGE_STATUS.REPLIED);
      
      // Close the reply modal
      setShowReplyModal(false);
      
      // Show success message
      alert('Reply sent successfully');
      
    } catch (err) {
      console.error('Error sending reply:', err);
      setError(err.message || 'Failed to send reply');
    } finally {
      setIsSendingReply(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Contact Messages</h1>
      
      {/* Search and filter */}
      <div className="bg-white shadow-md rounded-lg mb-6 p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="w-full md:w-1/2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
              {searchTerm && (
                <button
                  onClick={resetSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-auto flex items-center space-x-4">
            <div className="flex items-center">
              <span className="mr-2 text-gray-600">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Messages</option>
                <option value={MESSAGE_STATUS.UNREAD}>Unread</option>
                <option value={MESSAGE_STATUS.READ}>Read</option>
                <option value={MESSAGE_STATUS.IN_PROGRESS}>In Progress</option>
                <option value={MESSAGE_STATUS.REPLIED}>Replied</option>
                <option value={MESSAGE_STATUS.ARCHIVED}>Archived</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Date Range Filter */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center">
            <span className="mr-2 text-gray-600">Date Range:</span>
            <select
              value={dateRangeType}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Time</option>
              <option value={DATE_RANGES.TODAY}>Today</option>
              <option value={DATE_RANGES.YESTERDAY}>Yesterday</option>
              <option value={DATE_RANGES.THIS_WEEK}>This Week</option>
              <option value={DATE_RANGES.LAST_WEEK}>Last Week</option>
              <option value={DATE_RANGES.THIS_MONTH}>This Month</option>
              <option value={DATE_RANGES.LAST_MONTH}>Last Month</option>
              <option value={DATE_RANGES.CUSTOM}>Custom Range</option>
            </select>
          </div>
          
          {/* Display selected date range */}
          {(startDate || endDate) && (
            <div className="flex items-center">
              <span className="mr-2 text-gray-600">
                {formatDateDisplay(startDate)} - {formatDateDisplay(endDate)}
              </span>
              <button
                onClick={() => {
                  setDateRangeType('');
                  setStartDate(null);
                  setEndDate(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Custom date picker */}
          {showDatePicker && (
            <div className="relative z-10">
              <DatePicker
                selected={startDate}
                onChange={handleCustomDateChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
                className="border rounded"
              />
            </div>
          )}
          
          {/* Clear all filters button */}
          {(searchTerm || filterStatus !== 'all' || startDate || endDate) && (
            <button
              onClick={resetFilters}
              className="ml-auto px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          )}
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Messages list */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-lg">No contact messages found</p>
            <p className="text-sm mt-2">
              {searchTerm || filterStatus !== 'all' || startDate || endDate ? (
                <>
                  No results match your criteria. <button onClick={resetFilters} className="text-green-600 hover:underline">Clear filters</button>
                </>
              ) : (
                'When customers submit the contact form, their messages will appear here.'
              )}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.map((message) => {
                  const messageStatus = message.status || MESSAGE_STATUS.UNREAD;
                  const statusConfig = STATUS_CONFIG[messageStatus] || STATUS_CONFIG[MESSAGE_STATUS.UNREAD];
                  
                  return (
                    <tr key={message.message_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {message.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <a href={`mailto:${message.email}`} className="text-green-600 hover:text-green-800">
                          {message.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {message.subject || 'No Subject'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(message.submitted_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex px-2 py-1 text-xs leading-5 font-semibold rounded-full ${statusConfig.bgColor} ${statusConfig.textColor} mr-2`}>
                            {statusConfig.label}
                          </span>
                          <select
                            value={messageStatus}
                            onChange={(e) => updateMessageStatus(message.message_id, e.target.value)}
                            className="text-xs border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            disabled={isUpdatingStatus}
                          >
                            {Object.values(MESSAGE_STATUS).map(status => (
                              <option key={status} value={status}>
                                {STATUS_CONFIG[status].label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewMessage(message)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          View
                        </button>
                        <button
                          onClick={() => confirmDelete(message.message_id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && messages.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {currentPage}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={!hasMore}
                className={`px-4 py-2 text-sm rounded-md ${
                  !hasMore
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* View Message Modal */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowModal(false)}></div>
          
          <div className="relative bg-white rounded-lg shadow-xl mx-4 max-w-2xl w-full z-10">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Message Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <div className="mb-4 flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">From</p>
                  <div className="mt-1 flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white">
                        {selectedMessage.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{selectedMessage.name}</p>
                      <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                  <select
                    value={selectedMessage.status || MESSAGE_STATUS.UNREAD}
                    onChange={(e) => updateMessageStatus(selectedMessage.message_id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    disabled={isUpdatingStatus}
                  >
                    {Object.values(MESSAGE_STATUS).map(status => (
                      <option key={status} value={status}>
                        {STATUS_CONFIG[status].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Subject</p>
                <p className="mt-1 text-sm text-gray-900">{selectedMessage.subject || 'No Subject'}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedMessage.submitted_at).toLocaleString()}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Message</p>
                <div className="mt-1 p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleReply(selectedMessage)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Reply
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    confirmDelete(selectedMessage.message_id);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowReplyModal(false)}></div>
          
          <div className="relative bg-white rounded-lg shadow-xl mx-4 max-w-3xl w-full z-10">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Reply to Message</h3>
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500 mb-1">To</p>
                <div className="flex items-center bg-gray-50 px-3 py-2 rounded-md">
                  <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white mr-2">
                    {selectedMessage.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedMessage.name}</p>
                    <p className="text-xs text-gray-500">{selectedMessage.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="reply-subject" className="block text-sm font-medium text-gray-500 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="reply-subject"
                  value={replyData.subject}
                  onChange={(e) => setReplyData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="reply-message" className="block text-sm font-medium text-gray-500">
                    Message
                  </label>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-500">Templates:</label>
                    <select
                      onChange={(e) => applyTemplate(e.target.value)}
                      className="text-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select template</option>
                      {replyTemplates.map((template, index) => (
                        <option key={index} value={index}>{template.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <textarea
                  id="reply-message"
                  value={replyData.message}
                  onChange={(e) => setReplyData(prev => ({ ...prev, message: e.target.value }))}
                  rows="8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Write your reply here..."
                ></textarea>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="include-original"
                    checked={replyData.includeOriginalMessage}
                    onChange={(e) => setReplyData(prev => ({ ...prev, includeOriginalMessage: e.target.checked }))}
                    className="h-4 w-4 border-gray-300 rounded text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="include-original" className="ml-2 text-sm text-gray-500">
                    Include original message in reply
                  </label>
                </div>
              </div>
              
              {replyData.includeOriginalMessage && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Original Message Preview:</p>
                  <div className="text-xs text-gray-600 whitespace-pre-wrap border-t border-gray-200 pt-2">
                    <p>From: {selectedMessage.name} &lt;{selectedMessage.email}&gt;</p>
                    <p>Date: {new Date(selectedMessage.submitted_at).toLocaleString()}</p>
                    <p>Subject: {selectedMessage.subject || 'No Subject'}</p>
                    <p className="mt-2">{selectedMessage.message}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setShowReplyModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                disabled={isSendingReply}
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                disabled={isSendingReply || !replyData.message.trim()}
              >
                {isSendingReply ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
          
          <div className="relative bg-white rounded-lg shadow-xl mx-4 max-w-md w-full z-10">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Confirm Deletion</h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to delete this message? This action cannot be undone.
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages; 