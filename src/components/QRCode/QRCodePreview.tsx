import React, { memo } from 'react';
import QRCode from 'react-qr-code';
import { Item } from '../../types';
import { formatCurrency } from '../../utils/qrGenerator';
import { QR_CODE_CONFIG } from '../../utils/constants';

interface QRCodePreviewProps {
  item: Item;
  qrSize?: number;
}

export const QRCodePreview: React.FC<QRCodePreviewProps> = memo(({ item, qrSize = 180 }) => {
  // Show placeholder values when fields are empty
  const displayName = item.name === 'Organisation Name' ? 'Organisation Name' : item.name;
  const displayUpiId = item.upiId === 'your-upi@bank' ? 'your-upi@bank' : item.upiId;
  const hasValidData = item.name !== 'Organisation Name' && item.upiId !== 'your-upi@bank' && item.price > 0;
  
  return (
    <div className="text-center">
      <div className="mb-3">
        <h3 className={`font-semibold text-base ${hasValidData ? 'text-gray-900' : 'text-gray-400'}`}>
          {displayName}
        </h3>
      </div>
      
      <div className="bg-white p-2 rounded-lg border inline-block">
        <QRCode
          value={item.qrCodeData}
          size={qrSize}
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
      
      <div className="mt-2 space-y-1">
        {item.price > 0 ? (
          <p className="text-lg font-bold text-green-600">
            {formatCurrency(item.price)}
          </p>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Amount to be entered manually
          </p>
        )}
        <p className={`text-sm ${hasValidData ? 'text-gray-600' : 'text-gray-400'}`}>
          {displayUpiId}
        </p>
        {item.description && (
          <p className="text-xs text-gray-500">{item.description}</p>
        )}
        {!hasValidData && (
          <p className="text-xs text-gray-400 mt-2">
            Fill in the fields above to generate your QR code
          </p>
        )}
      </div>
    </div>
  );
});

QRCodePreview.displayName = 'QRCodePreview';