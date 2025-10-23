import React from 'react';

const VideoUpload = ({ 
    selectedFile, 
    onFileChange, 
    videoDuration, 
    currentVideoUrl,
    isEdit = false 
}) => {
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="lesson-preview-section">
            <div className="form-group">
                <label className="form-label">🎥 Video Dosyası {!isEdit && '*'}</label>
                <div className="file-input-wrapper">
                    <input
                        className="file-input"
                        type="file"
                        id="video"
                        accept="video/*"
                        onChange={onFileChange}
                        required={!isEdit}
                    />
                    <label className="file-input-label" htmlFor="video">
                        <span className="file-input-icon">📁</span>
                        <div className="file-info">
                            <div className="file-name">
                                {selectedFile ? selectedFile.name : 'Video Dosyası Seçin'}
                            </div>
                            <div className="file-hint">
                                Desteklenen formatlar: MP4, WebM, AVI (Maksimum 100MB)
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            {isEdit && currentVideoUrl && !selectedFile && (
                <div className="video-preview-info">
                    <h3 className="lesson-preview-header">📹 Mevcut Video</h3>
                    <div className="video-details">
                        <a href={`http://localhost:5225${currentVideoUrl}`} target="_blank" rel="noopener noreferrer" className="video-name">
                            Video'yu Görüntüle
                        </a>
                    </div>
                </div>
            )}

            {selectedFile && (
                <div className="video-preview-info">
                    <h3 className="lesson-preview-header">📁 Seçilen Dosya</h3>
                    <div className="video-details">
                        <div className="video-name">{selectedFile.name}</div>
                        <div className="video-size">
                            📊 {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </div>
                    </div>
                </div>
            )}

            {videoDuration > 0 && (
                <div className="video-duration">
                    ⏱️ Video Süresi: {formatDuration(videoDuration)}
                </div>
            )}
        </div>
    );
};

export default VideoUpload;