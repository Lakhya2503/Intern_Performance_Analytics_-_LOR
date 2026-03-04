// Format date utility
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'N/A';
  }
};

// Format date time utility
export const formatDateTime = (dateString) => {
  if (!dateString) return null;
  try {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return null;
  }
};

// Get status badge color classes
export const getStatusBadge = (status) => {
  switch(status) {
    case 'generated':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'rejected':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'eligible':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

// Rejection suggestions messages
export const REJECTION_SUGGESTIONS = [
  "Hi [Name], thank you for your request. I regret to inform you that I will not be able to provide a Letter of Recommendation for you. I wish you the best in your future endeavors.",
  "Hello [Name], I appreciate you reaching out. After careful consideration, I must decline your request for a Letter of Recommendation.",
  "Hi [Name], thank you for considering me. Unfortunately, I am unable to write a Letter of Recommendation for you at this time.",
  "Hello [Name], I’m sorry, but I will not be able to provide a Letter of Recommendation. I hope you understand.",
  "Hi [Name], I appreciate your request. However, I must respectfully decline writing a Letter of Recommendation for you.",
  "Hello [Name], thank you for reaching out. I am not able to provide a Letter of Recommendation on your behalf.",
  "Hi [Name], after consideration, I will have to decline your request for a Letter of Recommendation.",
  "Hello [Name], I regret to inform you that I cannot provide a Letter of Recommendation for you.",
  "Hi [Name], thank you for your message. I am unable to support your request for a Letter of Recommendation.",
  "Hello [Name], I appreciate your interest, but I must decline your request for a Letter of Recommendation."
];

// Status options for filters
export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status', color: 'gray', icon: 'FaFilter' },
  { value: 'generated', label: 'LOR Generated', color: 'green', icon: 'FaCheckCircle' },
  { value: 'pending', label: 'All Interns', color: 'yellow', icon: 'FaClock' },
  { value: 'rejected', label: 'Rejected', color: 'red', icon: 'FaTimesCircle' },
];

// View options
export const VIEW_OPTIONS = {
  CARD: 'card',
  LIST: 'list'
};

// Items per page
export const ITEMS_PER_PAGE = 12;
