import React, { useState, useRef } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ onImageUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Convert file to base64
      const base64 = await fileToBase64(file);
      
      // Create preview
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage({
        file,
        url: imageUrl,
        name: file.name,
        size: file.size
      });

      // Call parent callback with base64 data
      if (onImageUpload) {
        await onImageUpload(base64.split(',')[1]); // Remove data:image/...;base64, prefix
      }

    } catch (err) {
      console.error('File processing error:', err);
      setError('Failed to process image file');
    } finally {
      setUploading(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const removeImage = () => {
    if (uploadedImage?.url) {
      URL.revokeObjectURL(uploadedImage.url);
    }
    setUploadedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="image-upload">
      <div className="upload-header">
        <h3>Medical Image Upload</h3>
        <p>Upload medical images for AI analysis</p>
      </div>

      {!uploadedImage ? (
        <div
          className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          {uploading ? (
            <div className="uploading-state">
              <div className="upload-spinner"></div>
              <p>Processing image...</p>
            </div>
          ) : (
            <div className="upload-content">
              <div className="upload-icon">📷</div>
              <h4>Drop image here or click to browse</h4>
              <p>Supports JPEG, PNG, GIF, WebP (max 10MB)</p>
              <button className="browse-btn" type="button">
                Browse Files
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="uploaded-image">
          <div className="image-preview">
            <img 
              src={uploadedImage.url} 
              alt="Uploaded medical image"
              onLoad={() => {
                // Revoke object URL after image loads to free memory
                // URL.revokeObjectURL(uploadedImage.url);
              }}
            />
            <button 
              className="remove-image"
              onClick={removeImage}
              title="Remove image"
            >
              ×
            </button>
          </div>
          
          <div className="image-info">
            <div className="image-details">
              <h4>{uploadedImage.name}</h4>
              <p>Size: {formatFileSize(uploadedImage.size)}</p>
              <p>Type: {uploadedImage.file.type}</p>
            </div>
            
            <div className="image-actions">
              <button 
                className="replace-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Replace Image
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="upload-guidelines">
        <h4>Image Guidelines:</h4>
        <ul>
          <li>Use high-quality, clear images for best analysis results</li>
          <li>Ensure proper lighting and focus</li>
          <li>Remove any patient identifying information before upload</li>
          <li>Supported formats: JPEG, PNG, GIF, WebP</li>
          <li>Maximum file size: 10MB</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUpload;
