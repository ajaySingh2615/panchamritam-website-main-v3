/**
 * Email Template Service
 * Provides functionality for working with email templates
 */

/**
 * Render a template by replacing variables with values from the data object
 * @param {string} template - The template string with variables in {{variable}} format
 * @param {object} data - Object containing values to replace variables
 * @returns {string} - The rendered template with variables replaced
 */
const renderTemplate = (template, data = {}) => {
  // Return the original template if it's not a string
  if (typeof template !== 'string') {
    return '';
  }
  
  // Replace variables in format {{variable_name}} with values from data object
  let renderedTemplate = template;
  
  // Find all variables in the template using regex
  const variableMatches = template.match(/\{\{([^}]+)\}\}/g) || [];
  
  // Replace each variable with its value
  variableMatches.forEach(match => {
    // Extract variable name without braces
    const variableName = match.replace(/\{\{|\}\}/g, '').trim();
    
    // Get the value from data object
    const value = data[variableName] !== undefined ? data[variableName] : match;
    
    // Replace all occurrences of this variable in the template
    renderedTemplate = renderedTemplate.replace(new RegExp(match, 'g'), value);
  });
  
  return renderedTemplate;
};

/**
 * Extract all variables from a template
 * @param {string} template - The template string with variables in {{variable}} format
 * @returns {string[]} - Array of variable names without braces
 */
const extractVariables = (template) => {
  if (typeof template !== 'string') {
    return [];
  }
  
  // Find all variables in the template using regex
  const variableMatches = template.match(/\{\{([^}]+)\}\}/g) || [];
  
  // Extract variable names without braces
  return variableMatches.map(match => match.replace(/\{\{|\}\}/g, '').trim());
};

/**
 * Generate a message ID for email tracking
 * @param {number} messageId - The database message ID
 * @returns {string} - A unique message ID string for email headers
 */
const generateMessageId = (messageId) => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `<message-${messageId}-${timestamp}-${random}@panchamritam.com>`;
};

/**
 * Extract original message ID from a reference string
 * @param {string} referenceString - The message ID reference string 
 * @returns {number|null} - Extracted message ID or null if not found
 */
const extractMessageId = (referenceString) => {
  if (!referenceString) return null;
  
  const match = referenceString.match(/message-(\d+)-\d+-\d+/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  
  return null;
};

module.exports = {
  renderTemplate,
  extractVariables,
  generateMessageId,
  extractMessageId
}; 