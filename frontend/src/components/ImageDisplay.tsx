import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { base64ToDataUrl } from '../utils/imageUtils';

interface ImageDisplayProps {
  userId: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  userId, 
  alt, 
  className = '', 
  fallback 
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(false);
        
        const response = await api.get(`/users/${userId}/profile/image`);
        
        if (response.data.image) {
          const dataUrl = base64ToDataUrl(response.data.image, response.data.contentType);
          setImageSrc(dataUrl);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchImage();
    } else {
      setLoading(false);
      setError(true);
    }
  }, [userId]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  if (error || !imageSrc) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className={`${className} bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white`}>
        <span className="text-2xl font-bold">
          {alt.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
    />
  );
};

export default ImageDisplay;
