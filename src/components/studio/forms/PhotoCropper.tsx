"use client";

import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface PhotoCropperProps {
  imageSrc: string;
  onCropComplete: (croppedBase64: string) => void;
  onCancel: () => void;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export function PhotoCropper({ imageSrc, onCropComplete, onCancel }: PhotoCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const aspect = 1; // 1:1 aspect ratio for profile photos

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  };

  const handleSave = async () => {
    if (!completedCrop || !imgRef.current) {
      onCancel(); // Or show an error
      return;
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    const rawWidth = completedCrop.width * scaleX;
    const rawHeight = completedCrop.height * scaleY;
    
    // Cap output resolution to 512x512 for profile pictures to prevent massive base64 strings
    const MAX_DIMENSION = 512;
    const downscale = Math.min(1, MAX_DIMENSION / Math.max(rawWidth, rawHeight));
    
    canvas.width = Math.floor(rawWidth * downscale);
    canvas.height = Math.floor(rawHeight * downscale);

    ctx.scale(downscale, downscale);
    ctx.imageSmoothingQuality = 'high';

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;

    const rotateRads = rotate * Math.PI / 180;
    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.save();
    
    // Move to crop center
    ctx.translate(-cropX, -cropY);
    // Move to center of image, rotate, move back
    ctx.translate(centerX, centerY);
    ctx.rotate(rotateRads);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
    );

    ctx.restore();

    // Convert to base64
    const base64Image = canvas.toDataURL('image/jpeg', 0.9);
    onCropComplete(base64Image);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Adjust Photo</h3>
          <button onClick={onCancel} className="text-slate-500 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-auto bg-slate-50 flex flex-col items-center">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            circularCrop
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imageSrc}
              style={{ transform: `scale(${scale}) rotate(${rotate}deg)`, maxHeight: '50vh' }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>

        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 flex-1">
              <ZoomOut className="h-4 w-4 text-slate-500" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full"
              />
              <ZoomIn className="h-4 w-4 text-slate-500" />
            </div>
            
            <button
              onClick={() => setRotate((r) => r + 90)}
              className="p-2 border border-slate-300 rounded hover:bg-slate-50"
              title="Rotate 90deg"
            >
              <RotateCw className="h-4 w-4 text-slate-700" />
            </button>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
