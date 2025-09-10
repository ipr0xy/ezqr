import React, { memo } from 'react';
import QRCode from 'react-qr-code';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Item } from '../../types';
import { formatCurrency } from '../../utils/qrGenerator';
import { QR_CODE_CONFIG } from '../../utils/constants';

interface QRCodeDisplayProps {
  item: Item;
  organizationName: string;
  qrSize?: number;
  compact?: boolean;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = memo(({ item, organizationName, qrSize, compact = false }) => {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="text-center bg-gray-50 p-3">
        <CardTitle className={`font-semibold text-gray-800 ${compact ? 'text-base' : 'text-lg'}`}>
          {organizationName}
        </CardTitle>
        <p className="text-xs text-gray-600">{item.name}</p>
      </CardHeader>
      <CardContent className="p-4 text-center">
        <div className="bg-white p-3 rounded-lg shadow-inner mb-3">
          <QRCode
            value={item.qrCodeData}
            size={qrSize ?? (compact ? 180 : QR_CODE_CONFIG.size)}
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
        <div className="space-y-1">
          <p className={`font-bold text-green-600 ${compact ? 'text-xl' : 'text-2xl'}`}>{formatCurrency(item.price)}</p>
          <p className="text-xs text-gray-600">{item.paymentNote}</p>
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