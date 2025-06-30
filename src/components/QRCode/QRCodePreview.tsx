import React, { memo } from 'react';
import QRCode from 'react-qr-code';
import { Item } from '../../types';
import { formatCurrency } from '../../utils/qrGenerator';
import { QR_CODE_CONFIG } from '../../utils/constants';

interface QRCodePreviewProps {
  item: Item;
}

export const QRCodePreview: React.FC<QRCodePreviewProps> = memo(({ item }) => {
  return (
    <div className="text-center">
      <div className="mb-3">
        <h3 className="font-semibold text-gray-900 text-base">{item.name}</h3>
      </div>
      
      <div className="bg-white p-3 rounded-lg border inline-block">
        <QRCode
          value={item.qrCodeData}
          size={180}
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
      
      <div className="mt-3 space-y-1">
        <p className="text-lg font-bold text-green-600">{formatCurrency(item.price)}</p>
        <p className="text-sm text-gray-600">{item.upiId}</p>
        {item.description && (
          <p className="text-xs text-gray-500">{item.description}</p>
        )}
      </div>
    </div>
  );
});

QRCodePreview.displayName = 'QRCodePreview';