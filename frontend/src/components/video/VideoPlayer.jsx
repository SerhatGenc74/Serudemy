import React from 'react';

const VideoPlayer = ({ 
    lecture, 
    videoRef, 
    onTimeUpdate, 
    onLoadedMetadata, 
    onEnded, 
    onPause,
    playbackPosition 
}) => {
    if (!lecture?.videoUrl) {
        return (
            <div className="video-container">
                <div className="video-error">
                    <p>Video bulunamadı</p>
                </div>
            </div>
        );
    }

    return (
        <div className="video-container">
            <video
                ref={videoRef}
                className="video-player"
                controls
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
                onEnded={onEnded}
                onPause={onPause}
            >
                <source src={lecture.videoUrl} type="video/mp4" />
                Tarayıcınız video etiketini desteklemiyor.
            </video>
        </div>
    );
};

export default VideoPlayer;