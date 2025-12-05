import React from 'react';

const PageRenderer = ({ imageSrc, onContentClick }) => {
    if (!imageSrc) return <div className="loading">Loading...</div>;

    return (
        <div className="page-renderer" onClick={onContentClick}>
            <div className="image-container">
                <img src={imageSrc} alt="Webtoon Cut" />
            </div>
        </div>
    );
};

export default PageRenderer;
