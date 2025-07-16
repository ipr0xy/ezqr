import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { QRCodePreview } from '../../components/QRCode/QRCodePreview';
import { useItemStore } from '../../store/itemStore';
import { validateFormData } from '../../utils/validation';
import { parseAmount, generatePaymentNote } from '../../utils/qrGenerator';
import { shareQRCode, downloadQRCode } from '../../utils/shareUtils';
import { ArrowLeft, Loader2, Download, Share2, Save } from 'lucide-react';
import { Item } from '../../types';

interface FormData {
  name: string;
  description: string;
  price: string;
  paymentNote: string;
  upiId: string;
}

const initialFormData: FormData = {
  name: '',
  description: '',
  price: '',
  paymentNote: '',
  upiId: ''
};

export const CreateItem: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  const navigate = useNavigate();
  const { createItem, isLoading, error, clearError } = useItemStore();
  
  // Generate preview QR code data - starts with default UPI string
  const previewItem = useMemo((): Item => {
    // Start with default UPI string
    let qrCodeData = 'upi://pay?cu=INR';
    
    // Add parameters as they are filled
    const params = new URLSearchParams();
    params.set('cu', 'INR'); // Always include currency
    
    if (formData.upiId.trim()) {
      params.set('pa', formData.upiId.trim());
    }
    
    if (formData.name.trim()) {
      params.set('pn', formData.name.trim());
    }
    
    if (formData.price && parseAmount(formData.price) > 0) {
      params.set('am', parseAmount(formData.price).toFixed(2));
    }
    
    const paymentNote = formData.paymentNote.trim() || 
      (formData.name.trim() ? generatePaymentNote(formData.name) : '');
    if (paymentNote) {
      params.set('tn', paymentNote);
    }
    
    qrCodeData = `upi://pay?${params.toString()}`;
    
    try {
      return {
        id: 'preview',
        name: formData.name.trim() || 'Organisation Name',
        description: formData.description.trim(),
        price: parseAmount(formData.price),
        paymentNote,
        upiId: formData.upiId.trim() || 'your-upi@bank',
        qrCodeData,
        organizationId: 'default',
        createdAt: new Date(),
        isActive: true
      };
    } catch {
      // Return default item even if there's an error
      return {
        id: 'preview',
        name: formData.name.trim() || 'Organisation Name',
        description: formData.description.trim(),
        price: parseAmount(formData.price),
        paymentNote: paymentNote,
        upiId: formData.upiId.trim() || 'your-upi@bank',
        qrCodeData,
        organizationId: 'default',
        createdAt: new Date(),
        isActive: true
      };
    }
  }, [formData]);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear store error
    if (error) {
      clearError();
    }
  }, [errors, error, clearError]);
  
  const handleSave = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      const item = await createItem({
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseAmount(formData.price),
        paymentNote: formData.paymentNote.trim(),
        upiId: formData.upiId.trim(),
        organizationId: 'default' // Legacy field, kept for compatibility
      });
      
      // Navigate to the created item's QR code page
      navigate(`/items/${item.id}/qr`);
    } catch (err) {
      console.error('Failed to create item:', err);
      // Error is handled by the store
    }
  }, [formData, createItem, navigate]);
  
  const handleDownload = useCallback(async () => {
    if (!previewItem || !formData.name.trim() || !formData.upiId.trim()) {
      alert('Please fill in Organisation Name and UPI ID before downloading.');
      return;
    }
    
    setIsDownloading(true);
    try {
      const qrElement = document.querySelector('#preview-qr svg') as SVGElement;
      await downloadQRCode(previewItem, qrElement);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Failed to download QR code. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }, [previewItem]);
  
  const handleShare = useCallback(async () => {
    if (!previewItem || !formData.name.trim() || !formData.upiId.trim()) {
      alert('Please fill in Organisation Name and UPI ID before sharing.');
      return;
    }
    
    setIsSharing(true);
    try {
      const qrElement = document.querySelector('#preview-qr svg') as SVGElement;
      await shareQRCode(previewItem, qrElement);
    } catch (error) {
      if (error instanceof Error && error.message === 'Share copied to clipboard') {
        alert('Payment details copied to clipboard!');
      } else {
        console.error('Error sharing:', error);
        alert('Failed to share. Please try again.');
      }
    } finally {
      setIsSharing(false);
    }
  }, [previewItem]);
  
  const handleBack = useCallback(() => {
    navigate('/items');
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mr-3 p-2"
            disabled={isLoading}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Create QR Code</h1>
        </div>
        
        {/* Scrollable Content */}
        <div className="overflow-y-auto" style={{ height: 'calc(100vh - 73px)' }}>
          <div className="p-4 pb-6 space-y-6">
            {/* Form Section */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Organisation / Payee Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your organisation name here."
                  className={`h-12 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  disabled={isLoading}
                  required
                  maxLength={100}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID
                </label>
                <Input
                  id="upiId"
                  name="upiId"
                  type="text"
                  value={formData.upiId}
                  onChange={handleChange}
                  placeholder="Enter your UPI ID."
                  className={`h-12 ${errors.upiId ? 'border-red-500' : 'border-gray-300'}`}
                  disabled={isLoading}
                  required
                  maxLength={50}
                />
                {errors.upiId && <p className="text-red-500 text-xs mt-1">{errors.upiId}</p>}
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Amount (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="1"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Leave empty for manual entry"
                    className={`h-12 pl-8 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Notes)
                </label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter transaction description here..."
                  className={`h-12 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  disabled={isLoading}
                  maxLength={200}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
              
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                  {error}
                </div>
              )}
            </div>
            
            {/* QR Code Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-4">
                <div id="preview-qr">
                  <QRCodePreview item={previewItem} />
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="h-11 border-blue-200 text-blue-600 hover:bg-blue-50"
                      disabled={isDownloading || !formData.name.trim() || !formData.upiId.trim() || !formData.price}
                    >
                      {isDownloading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      Download
                    </Button>
                    
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="h-11 border-green-200 text-green-600 hover:bg-green-50"
                      disabled={isSharing || !formData.name.trim() || !formData.upiId.trim() || !formData.price}
                    >
                      {isSharing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Share2 className="w-4 h-4 mr-2" />
                      )}
                      Share
                    </Button>
                  </div>
                  
                  <Button
                    onClick={handleSave}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving QR Code...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save QR Code
                      </>
                    )}
                  </Button>
                </div>
              </div>
              {/* Added Padding */}
              <div className='h-10'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};