import { Item } from '../types';

const createShareText = (item: Item): string => {
  return `${item.name} - Pay ₹${item.price}
UPI ID: ${item.upiId}
${item.description ? `Description: ${item.description}` : ''}
Note: ${item.paymentNote}

Scan QR code or use UPI ID to pay instantly.`;
};

const createCanvas = (width: number, height: number): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

const drawQRCodeToCanvas = (
  canvas: HTMLCanvasElement,
  qrElement: SVGElement,
  item: Item
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    const svgData = new XMLSerializer().serializeToString(qrElement);
    const img = new Image();
    
    img.onload = () => {
      try {
        // White background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add header
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 32px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.name, canvas.width / 2, 60);
        
        // Add description if available
        if (item.description) {
          ctx.font = '24px Arial, sans-serif';
          ctx.fillStyle = '#6b7280';
          ctx.fillText(item.description, canvas.width / 2, 100);
        }
        
        // Draw QR code (centered)
        const qrSize = 400;
        const qrX = (canvas.width - qrSize) / 2;
        const qrY = 150;
        ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
        
        // Add amount
        ctx.font = 'bold 48px Arial, sans-serif';
        ctx.fillStyle = '#059669';
        ctx.fillText(`₹${item.price}`, canvas.width / 2, qrY + qrSize + 80);
        
        // Add payment note
        if (item.paymentNote) {
          ctx.font = '20px Arial, sans-serif';
          ctx.fillStyle = '#6b7280';
          ctx.fillText(item.paymentNote, canvas.width / 2, qrY + qrSize + 120);
        }
        
        // Add UPI ID
        ctx.font = '18px Arial, sans-serif';
        ctx.fillStyle = '#374151';
        ctx.fillText(`UPI ID: ${item.upiId}`, canvas.width / 2, qrY + qrSize + 160);
        
        // Add instructions
        ctx.font = '16px Arial, sans-serif';
        ctx.fillStyle = '#9ca3af';
        ctx.fillText('Scan this QR code with any UPI app to pay', canvas.width / 2, qrY + qrSize + 200);
        
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load QR code image'));
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  });
};

export const shareQRCode = async (
  item: Item,
  qrElement: SVGElement | null | undefined
): Promise<void> => {
  const shareText = createShareText(item);
  
  if (!navigator.share) {
    // Fallback for browsers without native share
    try {
      await navigator.clipboard.writeText(shareText);
      throw new Error('Share copied to clipboard');
    } catch (clipboardError) {
      throw new Error('Sharing not supported on this device');
    }
  }

  if (!qrElement) {
    // Text-only sharing
    try {
      await navigator.share({
        title: `${item.name} - Payment QR Code`,
        text: shareText,
        url: window.location.href
      });
    } catch (error) {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareText);
      throw new Error('Share copied to clipboard');
    }
    return;
  }

  // Try to share with image
  try {
    const canvas = createCanvas(800, 1000);
    await drawQRCodeToCanvas(canvas, qrElement, item);
    
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png', 1.0);
    });
    
    if (blob) {
      const file = new File([blob], `${item.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qr_code.png`, { 
        type: 'image/png' 
      });
      
      try {
        await navigator.share({
          title: `${item.name} - Payment QR Code`,
          text: `Pay ₹${item.price} for ${item.name}`,
          files: [file]
        });
        return;
      } catch (shareError) {
        // Fallback to text sharing
        await navigator.share({
          title: `${item.name} - Payment QR Code`,
          text: shareText,
          url: window.location.href
        });
        return;
      }
    }
  } catch (error) {
    console.warn('Image sharing failed, falling back to text:', error);
  }

  // Final fallback
  try {
    await navigator.share({
      title: `${item.name} - Payment QR Code`,
      text: shareText,
      url: window.location.href
    });
  } catch (error) {
    await navigator.clipboard.writeText(shareText);
    throw new Error('Share copied to clipboard');
  }
};

export const downloadQRCode = async (
  item: Item,
  qrElement: SVGElement | null | undefined
): Promise<void> => {
  if (!qrElement) {
    throw new Error('QR code element not found');
  }

  try {
    const canvas = createCanvas(800, 1000);
    await drawQRCodeToCanvas(canvas, qrElement, item);
    
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png', 1.0);
    });
    
    if (!blob) {
      throw new Error('Failed to create image');
    }
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qr_code.png`;
    
    // Ensure the link is added to DOM for Firefox compatibility
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error('Failed to download QR code. Please try again.');
  }
};