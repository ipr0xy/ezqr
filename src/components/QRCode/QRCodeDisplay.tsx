import React, { memo } from 'react';
import QRCode from 'react-qr-code';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Item } from '../../types';
import { formatCurrency } from '../../utils/qrGenerator';
import { QR_CODE_CONFIG } from '../../utils/constants';

interface QRCodeDisplayProps {
  item: Item;
  organizationName: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = memo(({ item, organizationName }) => {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="text-center bg-gray-50">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {organizationName}
        </CardTitle>
        <p className="text-sm text-gray-600">{item.name}</p>
      </CardHeader>
      <CardContent className="p-6 text-center">
        <div className="bg-white p-4 rounded-lg shadow-inner mb-4">
          <QRCode
            value={item.qrCodeData}
            size={QR_CODE_CONFIG.size}
            style={{ 
              height: "auto", 
              maxWidth: "100%", 
              width: "100%",
              backgroundColor: QR_CODE_CONFIG.backgroundColor,
              color: QR_CODE_CONFIG.foregroundColor
            }}
            level={QR_CODE_CONFIG.level}
          />
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-green-600">{formatCurrency(item.price)}</p>
          <p className="text-sm text-gray-600">{item.paymentNote}</p>
          <p className="text-xs text-gray-500">Scan to pay with UPI</p>
          {!item.isActive && (
            <p className="text-xs text-red-500 font-medium">QR Code is disabled</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

QRCodeDisplay.displayName = 'QRCodeDisplay';