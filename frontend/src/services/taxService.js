import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

class TaxService {
  // Get tax info for a product
  static async getProductTaxInfo(productId) {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.PRODUCTS}/${productId}/tax`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching product tax info:', error);
      throw error;
    }
  }
  
  // Calculate product price with tax
  static async calculatePriceWithTax(productId, quantity = 1) {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.PRODUCTS}/${productId}/price-with-tax?quantity=${quantity}`
      );
      return response.data;
    } catch (error) {
      console.error('Error calculating price with tax:', error);
      throw error;
    }
  }
  
  // Admin: Get all GST rates
  static async getAllGSTRates(token) {
    try {
      const response = await axios.get(API_ENDPOINTS.GST, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching GST rates:', error);
      throw handleApiError(error);
    }
  }
  
  // Admin: Create GST rate
  static async createGSTRate(rateData, token) {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.TAX}/gst`,
        rateData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating GST rate:', error);
      throw error;
    }
  }
  
  // Admin: Update GST rate
  static async updateGSTRate(rateId, rateData, token) {
    try {
      const response = await axios.patch(
        `${API_ENDPOINTS.TAX}/gst/${rateId}`,
        rateData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating GST rate:', error);
      throw error;
    }
  }
  
  // Admin: Delete GST rate
  static async deleteGSTRate(rateId, token) {
    try {
      const response = await axios.delete(
        `${API_ENDPOINTS.TAX}/gst/${rateId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting GST rate:', error);
      throw error;
    }
  }
  
  // Admin: Get all HSN codes
  static async getAllHSNCodes(page = 1, limit = 100, token) {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.TAX}/hsn?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching HSN codes:', error);
      // Return a structured empty response instead of throwing an error
      // This will prevent the component from crashing
      return {
        status: 'error',
        message: 'Could not load HSN codes. The database table might not exist yet.',
        data: {
          codes: [],
          pagination: {
            page: 1,
            limit,
            hasMore: false
          }
        }
      };
    }
  }
  
  // Admin: Search HSN codes
  static async searchHSNCodes(query, token) {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.TAX}/hsn/search?query=${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error searching HSN codes:', error);
      throw error;
    }
  }
  
  // Admin: Create HSN code
  static async createHSNCode(codeData, token) {
    try {
      // Log the data being sent to help debug
      console.log('Creating HSN code with data:', codeData);
      
      // Ensure all data is properly formatted
      const formattedData = {
        code: codeData.code.trim(),
        description: codeData.description ? codeData.description.trim() : null,
        default_gst_rate_id: codeData.default_gst_rate_id ? Number(codeData.default_gst_rate_id) : null
      };
      
      console.log('Formatted data:', formattedData);
      
      const response = await axios.post(
        `${API_ENDPOINTS.TAX}/hsn`,
        formattedData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating HSN code:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
        throw {
          ...error,
          message: error.response.data.message || 'Failed to create HSN code'
        };
      }
      throw error;
    }
  }
  
  // Admin: Update HSN code
  static async updateHSNCode(codeId, codeData, token) {
    try {
      const response = await axios.patch(
        `${API_ENDPOINTS.TAX}/hsn/${codeId}`,
        codeData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating HSN code:', error);
      throw error;
    }
  }
  
  // Admin: Bulk import HSN codes
  static async bulkImportHSNCodes(codesData, token) {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.TAX}/hsn/bulk-import`,
        { codes: codesData },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error bulk importing HSN codes:', error);
      throw error;
    }
  }
  
  // Admin: Update product tax attributes
  static async updateProductTaxAttributes(productId, taxData, token) {
    try {
      // Format the data properly for the backend
      const formattedData = {
        hsn_code_id: taxData.hsn_code_id ? Number(taxData.hsn_code_id) : null,
        is_branded: taxData.is_branded === true ? 1 : 0,
        is_packaged: taxData.is_packaged === true ? 1 : 0,
        custom_gst_rate_id: taxData.custom_gst_rate_id ? Number(taxData.custom_gst_rate_id) : null
      };
      
      console.log('Sending tax data to backend:', formattedData);
      
      const response = await axios.patch(
        `${API_ENDPOINTS.PRODUCTS}/${productId}/tax`,
        formattedData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating product tax attributes:', error);
      throw error;
    }
  }
  
  // Admin: Bulk update product tax attributes
  static async bulkUpdateProductTaxAttributes(productIds, taxAttributes, token) {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.PRODUCTS}/bulk-update-tax`,
        {
          product_ids: productIds,
          tax_attributes: taxAttributes
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error bulk updating product tax attributes:', error);
      throw error;
    }
  }
  
  // Get invoice for an order
  static async getOrderInvoice(orderId, token) {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.ORDERS}/${orderId}/invoice`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching order invoice:', error);
      throw error;
    }
  }
  
  // Generate PDF invoice for order
  static async generateInvoicePDF(orderId, token) {
    try {
      // Request the PDF as a blob
      const response = await axios.get(
        `${API_ENDPOINTS.ORDERS}/${orderId}/invoice/pdf`,
        {
          headers: { 
            Authorization: `Bearer ${token}` 
          },
          responseType: 'blob' // Important for binary responses
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error generating invoice PDF:', error);
      throw handleApiError(error);
    }
  }
  
  // Helper function to download a blob as a file
  static downloadInvoicePDF(blob, invoiceNumber) {
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Invoice-${invoiceNumber}.pdf`);
    
    // Add the link to the document
    document.body.appendChild(link);
    
    // Trigger the download
    link.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }
  
  // Email invoice to specified email address
  static async emailInvoice(orderId, email, token) {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.ORDERS}/${orderId}/invoice/email`,
        { email },
        {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error emailing invoice:', error);
      throw handleApiError(error);
    }
  }
  
  // Get tax summary for a specified date range
  static async getTaxSummary(startDate, endDate, token) {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.TAX}/summary?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching tax summary:', error);
      throw error;
    }
  }
}

export default TaxService; 