import React from 'react';

const VideoInfo = ({ lecture, progressPercentage, watchedSeconds }) => {
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="video-info">
            <h1 className="video-title">{lecture?.name || 'Ders Adı'}</h1>
            <p className="video-description">{lecture?.videoDesc || 'Ders açıklaması bulunmuyor.'}</p>
            
            <div className="progress-info">
                <div className="progress-bar">
                    <div 
                        className="progress-fill" 
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <div className="progress-stats">
                    <span>İlerleme: {Math.round(progressPercentage)}%</span>
                    <span>İzlenen Süre: {formatTime(watchedSeconds)}</span>
                    {lecture?.lectureDuration && (
                        <span>Toplam Süre: {formatTime(lecture.lectureDuration)}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoInfo;