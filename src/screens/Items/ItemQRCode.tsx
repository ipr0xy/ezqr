import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { QRCodeDisplay } from '../../components/QRCode/QRCodeDisplay';
import { useItemStore } from '../../store/itemStore';
import { shareQRCode, downloadQRCode } from '../../utils/shareUtils';
import { validateFormData } from '../../utils/validation';
import { parseAmount } from '../../utils/qrGenerator';
import { ArrowLeft, Edit, Trash2, ToggleLeft, ToggleRight, Save, X, Loader2, Download, Share2 } from 'lucide-react';

interface EditFormData {
  name: string;
  description: string;
  price: string;
  paymentNote: string;
  upiId: string;
}

export const ItemQRCode: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const qrRef = useRef<HTMLDivElement>(null);
  
  const { 
    getItemById, 
    updateItem, 
    deleteItem, 
    toggleItemStatus, 
    isLoading, 
    error, 
    clearError 
  } = useItemStore();
  
  const item = itemId ? getItemById(itemId) : undefined;
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [editData, setEditData] = useState<EditFormData>({
    name: '',
    description: '',
    price: '',
    paymentNote: '',
    upiId: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Initialize edit data when item changes
  useEffect(() => {
    if (item) {
      setEditData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        paymentNote: item.paymentNote,
        upiId: item.upiId
      });
    }
  }, [item]);
  
  const handleShare = useCallback(async () => {
    if (!item) return;
    
    setIsSharing(true);
    try {
      const qrElement = qrRef.current?.querySelector('svg') as SVGElement | null;
      await shareQRCode(item, qrElement);
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
  }, [item]);
  
  const handleDownload = useCallback(async () => {
    if (!item) return;
    
    setIsDownloading(true);
    try {
      const qrElement = qrRef.current?.querySelector('svg') as SVGElement | null;
      await downloadQRCode(item, qrElement);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Failed to download QR code. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }, [item]);
  
  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setErrors({});
    clearError();
  }, [clearError]);
  
  const handleCancelEdit = useCallback(() => {
    if (!item) return;
    
    setIsEditing(false);
    setEditData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      paymentNote: item.paymentNote,
      upiId: item.upiId
    });
    setErrors({});
    clearError();
  }, [item, clearError]);
  
  const handleSaveEdit = useCallback(async () => {
    if (!itemId) return;
    
    // Validate form
    const validationErrors = validateFormData(editData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      await updateItem(itemId, {
        name: editData.name.trim(),
        description: editData.description.trim(),
        price: parseAmount(editData.price),
        paymentNote: editData.paymentNote.trim(),
        upiId: editData.upiId.trim()
      });
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      console.error('Failed to update item:', error);
      // Error is handled by the store
    }
  }, [itemId, editData, updateItem]);
  
  const handleDelete = useCallback(() => {
    if (!item) return;
    
    if (window.confirm('Are you sure you want to delete this QR code? This action cannot be undone.')) {
      deleteItem(item.id);
      navigate('/items');
    }
  }, [item, deleteItem, navigate]);
  
  const handleToggleStatus = useCallback(() => {
    if (!item) return;
    toggleItemStatus(item.id);
  }, [item, toggleItemStatus]);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear store error
    if (error) {
      clearError();
    }
  }, [errors, error, clearError]);
  
  const handleBack = useCallback(() => {
    navigate('/items');
  }, [navigate]);
  
  if (!item) {
    return (
      <div className="p-4 pb-20">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">QR Code not found</h2>
          <Button onClick={handleBack}>
            Back to QR Codes
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading || isLoading}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            disabled={isSharing || isLoading}
          >
            {isSharing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Share2 className="w-4 h-4 mr-2" />
            )}
            Share
          </Button>
        </div>
      </div>
      
      {isEditing ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Edit QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                Organisation/Payee Name *
              </label>
              <Input
                id="edit-name"
                name="name"
                type="text"
                value={editData.name}
                onChange={handleInputChange}
                placeholder="Enter organisation or payee name"
                className={errors.name ? 'border-red-500' : ''}
                disabled={isLoading}
                required
                maxLength={100}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="edit-upiId" className="block text-sm font-medium text-gray-700 mb-1">
                UPI ID *
              </label>
              <Input
                id="edit-upiId"
                name="upiId"
                type="text"
                value={editData.upiId}
                onChange={handleInputChange}
                placeholder="your-upi@bank"
                className={errors.upiId ? 'border-red-500' : ''}
                disabled={isLoading}
                required
                maxLength={50}
              />
              {errors.upiId && <p className="text-red-500 text-xs mt-1">{errors.upiId}</p>}
            </div>
            
            <div>
              <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹) *
              </label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                step="0.01"
                min="1"
                max="100000"
                value={editData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                className={errors.price ? 'border-red-500' : ''}
                disabled={isLoading}
                required
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
            
            <div>
              <label htmlFor="edit-paymentNote" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Note
              </label>
              <Input
                id="edit-paymentNote"
                name="paymentNote"
                type="text"
                value={editData.paymentNote}
                onChange={handleInputChange}
                placeholder="Payment for [organisation name]"
                disabled={isLoading}
                maxLength={100}
              />
              {errors.paymentNote && <p className="text-red-500 text-xs mt-1">{errors.paymentNote}</p>}
            </div>
            
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Input
                id="edit-description"
                name="description"
                type="text"
                value={editData.description}
                onChange={handleInputChange}
                placeholder="Brief description (optional)"
                disabled={isLoading}
                maxLength={200}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
            
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                onClick={handleSaveEdit}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900">{item.name}</h1>
              <div className="flex items-center gap-1">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.isActive ? 'Active' : 'Disabled'}
                </span>
              </div>
            </div>
            {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
          </div>
          
          <div ref={qrRef}>
            <QRCodeDisplay item={item} organizationName={item.name} qrSize={200} compact />
          </div>
          
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>Customers can scan this QR code to pay instantly</p>
            <p className="mt-1">UPI ID: {item.upiId}</p>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex gap-2">
              <Button
                onClick={handleEdit}
                variant="outline"
                className="flex-1 h-10"
                disabled={isLoading}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={handleToggleStatus}
                variant="outline"
                className="flex-1 h-10"
                disabled={isLoading}
              >
                {item.isActive ? (
                  <>
                    <ToggleLeft className="w-4 h-4 mr-2" />
                    Disable
                  </>
                ) : (
                  <>
                    <ToggleRight className="w-4 h-4 mr-2" />
                    Enable
                  </>
                )}
              </Button>
            </div>
            
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="w-full h-10"
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete QR Code
            </Button>
          </div>
        </>
      )}
    </div>
  );
};