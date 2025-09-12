import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useItemStore } from '../../store/itemStore';
import { formatCurrency } from '../../utils/qrGenerator';
import { Package, QrCode, ToggleLeft, ToggleRight } from 'lucide-react';

export const ItemList: React.FC = () => {
  const navigate = useNavigate();
  const { items, toggleItemStatus, error, clearError } = useItemStore();
  
  const handleViewQR = useCallback((itemId: string) => {
    navigate(`/items/${itemId}/qr`);
  }, [navigate]);
  
  const handleCreateNew = useCallback(() => {
    navigate('/items/create');
  }, [navigate]);
  
  const handleToggleStatus = useCallback((itemId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the card click
    toggleItemStatus(itemId);
  }, [toggleItemStatus]);
  
  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);
  
  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My QR Codes</h1>
        <p className="text-gray-600">Manage your payment QR codes</p>
      </div>
      
      {error && (
        <Card className="mb-4 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-red-800 text-sm">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearError}
                className="text-red-600 hover:text-red-800"
              >
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {items.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No QR codes yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first QR code to start receiving payments.
            </p>
            <Button onClick={handleCreateNew}>
              Create QR Code
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card 
              key={item.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleViewQR(item.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                      <button
                        onClick={(e) => handleToggleStatus(item.id, e)}
                        className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                        aria-label={item.isActive ? 'Disable QR code' : 'Enable QR code'}
                      >
                        {item.isActive ? (
                          <ToggleRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-2 truncate">{item.description}</p>
                    )}
                    <p className="text-lg font-bold text-green-600">{formatCurrency(item.price)}</p>
                    <p className="text-xs text-gray-500 truncate">{item.paymentNote}</p>
                    <p className="text-xs text-blue-600 mt-1 truncate">UPI: {item.upiId}</p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewQR(item.id);
                      }}
                      aria-label="View QR code"
                    >
                      <QrCode className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};