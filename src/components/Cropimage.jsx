import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Helper to crop image into a blob
const getCroppedImg = (image, crop, fileName) => {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Canvas is empty');
        return;
      }
      blob.name = fileName;
      resolve(blob);
    }, 'image/png', 1); // You can specify 'image/jpeg' or other formats
  });
};

const ImageCropperModal = ({ src, onDone }) => {
  // isOpen state is managed internally, initialized based on `src` prop presence
  // This allows the modal to open when `src` is provided.
  const [isOpen, setIsOpen] = useState(!!src); 
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);

  // Function to handle closing the modal, passing null to onDone for cancellation
  const handleClose = () => {
    setIsOpen(false);
    onDone(null); // Indicate cancellation to the parent component
  };

  // Function to handle saving the cropped image
  const handleSave = async () => {
    if (!completedCrop || !imgRef.current) {
      console.warn("No crop selected or image not loaded.");
      return;
    }

    const blob = await getCroppedImg(imgRef.current, completedCrop, 'cropped.png');
    setIsOpen(false); // Close the modal
    onDone(blob); // Pass the cropped image blob to the parent component
  };

  // Callback for when the image inside ReactCrop loads
  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    // Set an initial square crop area, 80% of the smaller dimension, centered
    const side = Math.min(width, height) * 0.8; 

    setCrop({
      unit: 'px',
      width: side,
      height: side,
      x: (width - side) / 2,
      y: (height - side) / 2,
    });
  };

  // If the modal is not open, render nothing
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 bg-blur-[120px] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[95vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Crop Image</h2>

        {src && ( // Only render ReactCrop if an image source is provided
          <ReactCrop
            crop={crop}
            onChange={setCrop} // Update crop state as user interacts
            onComplete={(c) => setCompletedCrop(c)} // Set completed crop when user finishes dragging
            aspect={1} // Enforce a 1:1 aspect ratio for the crop selection
            minWidth={30} // Minimum width for the crop box
            minHeight={30} // Minimum height for the crop box
          >
            <img
              ref={imgRef}
              src={src}
              alt="Crop source"
              onLoad={onImageLoad} // Handle initial crop setup when image loads
              style={{ maxWidth: '100%', height: 'auto' }} // Ensure image scales within its container
            />
          </ReactCrop>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={!completedCrop} // Disable save button until a valid crop is made
          >
            Save Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
