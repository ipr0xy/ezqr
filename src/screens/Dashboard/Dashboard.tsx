import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useItemStore } from '../../store/itemStore';
import { Package, Plus, QrCode } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { items, error, clearError } = useItemStore();
  
  const stats = useMemo(() => {
    const totalItems = items.length;
    const activeItems = items.filter(item => item.isActive).length;
    const totalValue = items.reduce((sum, item) => sum + (item.isActive ? item.price : 0), 0);
    
    return {
      totalItems,
      activeItems,
      totalValue
    };
  }, [items]);
  
  const handleCreateNew = useCallback(() => {
    navigate('/items/create');
  }, [navigate]);
  
  const handleViewAll = useCallback(() => {
    navigate('/items');
  }, [navigate]);
  
  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);
  
  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">QR Ez</h1>
        <p className="text-gray-600">Create UPI QR codes easily</p>
      </div>
      
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
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
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <QrCode className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
            <p className="text-sm text-gray-600">Total QR Codes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.activeItems}</p>
            <p className="text-sm text-gray-600">Active QR Codes</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleCreateNew}
              className="w-full justify-start"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New QR Code
            </Button>
            
            <Button
              onClick={handleViewAll}
              className="w-full justify-start"
              variant="outline"
            >
              <Package className="w-4 h-4 mr-2" />
              View All QR Codes
            </Button>
          </CardContent>
        </Card>
        
        {stats.totalItems === 0 && (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-6 text-center">
              <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Create your first QR code
              </h3>
              <p className="text-gray-600 mb-4">
                Generate UPI QR codes for instant payments in seconds.
              </p>
              <Button onClick={handleCreateNew}>
                Get Started
              </Button>
            </CardContent>
          </Card>
        )}
        
        {stats.totalItems > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total QR Codes:</span>
                  <span className="font-medium">{stats.totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active QR Codes:</span>
                  <span className="font-medium text-green-600">{stats.activeItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Active Value:</span>
                  <span className="font-medium">₹{stats.totalValue.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};