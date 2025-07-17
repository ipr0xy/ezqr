import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { User, Info, Heart } from 'lucide-react';

export const Profile: React.FC = () => {
  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">About</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            EZ QR
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">EZ QR App</h3>
            <p className="text-gray-600">Create UPI QR codes easily</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            How it works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              <strong>1.</strong> Enter your item/service details
            </p>
            <p className="text-sm text-gray-700">
              <strong>2.</strong> Add your UPI ID and amount
            </p>
            <p className="text-sm text-gray-700">
              <strong>3.</strong> Generate QR code instantly
            </p>
            <p className="text-sm text-gray-700">
              <strong>4.</strong> Share with customers for payments
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 text-center">
          <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            Made with ❤️ for easy UPI payments ~ pr0xy
          </p>
        </CardContent>
      </Card>
    </div>
  );
};