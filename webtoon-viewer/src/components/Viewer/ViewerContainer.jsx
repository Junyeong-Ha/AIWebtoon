import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { webtoons } from '../../data/mockData';
import PageRenderer from './PageRenderer';
import AudioController from './AudioController';
import './Viewer.css';

const ViewerContainer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [webtoon, setWebtoon] = useState(null);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(false);

    // 첫 번째 이미지의 비율을 저장
    const [imageAspectRatio, setImageAspectRatio] = useState(null);
    const [viewerWidth, setViewerWidth] = useState(0);

    // Swipe State
    const [touchStart, setTouchStart] = useState(null);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const minSwipeDistance = 50;

    // Load Webtoon Data
    useEffect(() => {
        const data = webtoons.find(w => w.id === id);
        if (data) {
            setWebtoon(data);
        } else {
            alert("Webtoon not found!");
            navigate('/');
        }
    }, [id, navigate]);

    // 첫 번째 이미지 로드하여 비율 계산
    useEffect(() => {
        if (!webtoon || !webtoon.pages || webtoon.pages.length === 0) return;

        const firstImagePath = `${webtoon.basePath}/${webtoon.pages[0].image}`;
        const img = new Image();
        img.onload = () => {
            const ratio = img.width / img.height;
            setImageAspectRatio(ratio);
        };
        img.src = firstImagePath;
    }, [webtoon]);

    // 키보드 이벤트 리스너
    useEffect(() => {
        if (!webtoon) return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                if (currentPageIndex > 0) {
                    setCurrentPageIndex(prev => prev - 1);
                    setCurrentDialogueIndex(0);
                }
            } else if (e.key === 'ArrowRight') {
                const currentPage = webtoon.pages[currentPageIndex];
                if (currentPage.dialogues && currentDialogueIndex < currentPage.dialogues.length - 1) {
                    setCurrentDialogueIndex(prev => prev + 1);
                } else if (currentPageIndex < webtoon.pages.length - 1) {
                    setCurrentPageIndex(prev => prev + 1);
                    setCurrentDialogueIndex(0);
                } else {
                    alert("End of Episode!");
                    navigate('/');
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentPageIndex, currentDialogueIndex, webtoon, navigate]);

    if (!webtoon) return <div>Loading...</div>;

    const currentPage = webtoon.pages[currentPageIndex];
    const currentDialogue = currentPage?.dialogues[currentDialogueIndex];

    // Helper to get full asset path
    const getAssetPath = (filename) => {
        if (!filename) return null;
        return `${webtoon.basePath}/${filename}`;
    };

    const onTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
        setIsDragging(true);
        setDragOffset(0);
    };

    const onTouchMove = (e) => {
        if (!isDragging || touchStart === null) return;
        const currentTouch = e.targetTouches[0].clientX;
        const diff = currentTouch - touchStart;
        setDragOffset(diff);
    };

    const onTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        // Determine if we should change page
        if (dragOffset > minSwipeDistance) {
            // Swipe Right -> Prev Page
            handlePagePrev();
        } else if (dragOffset < -minSwipeDistance) {
            // Swipe Left -> Next Page
            handlePageNext();
        }

        // Reset offset (will animate back if no page change)
        setDragOffset(0);
        setTouchStart(null);
    };

    const handlePageNext = () => {
        if (currentPageIndex < webtoon.pages.length - 1) {
            setCurrentPageIndex(prev => prev + 1);
            setCurrentDialogueIndex(0);
        } else {
            alert("End of Episode!");
            navigate('/');
        }
    };

    const handlePagePrev = () => {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(prev => prev - 1);
            setCurrentDialogueIndex(0);
        }
    };

    const handleContentClick = (e) => {
        // 드래그 중이면 무시
        if (Math.abs(dragOffset) > 5) return;

        // 클릭 위치가 화면 중앙 기준 왼쪽인지 오른쪽인지 확인
        const clickX = e.clientX || e.touches?.[0]?.clientX;
        if (!clickX) return;

        const screenCenter = window.innerWidth / 2;

        if (clickX < screenCenter) {
            // 왼쪽 클릭 - 이전 페이지
            handlePagePrev();
        } else {
            // 오른쪽 클릭 - 다음 페이지 (대사 진행 포함)
            handleNext();
        }
    };

    const handleNext = () => {
        if (currentPage.dialogues && currentDialogueIndex < currentPage.dialogues.length - 1) {
            setCurrentDialogueIndex(prev => prev + 1);
        } else if (currentPageIndex < webtoon.pages.length - 1) {
            setCurrentPageIndex(prev => prev + 1);
            setCurrentDialogueIndex(0);
        } else {
            alert("End of Episode!");
            navigate('/');
        }
    };

    // viewer-content의 크기 계산 (첫 번째 이미지 비율 기준)
    const getViewerContentStyle = () => {
        if (!imageAspectRatio) return {};

        // 헤더 높이는 대략 60px로 가정 (padding 1rem * 2 + button height)
        const headerHeight = 60;
        const availableHeight = window.innerHeight - headerHeight;
        const availableWidth = window.innerWidth;

        // 이미지 비율에 맞춰 크기 계산
        let width, height;

        if (availableWidth / availableHeight > imageAspectRatio) {
            // 화면이 더 넓은 경우: 높이를 기준으로 계산
            height = availableHeight;
            width = height * imageAspectRatio;
        } else {
            // 화면이 더 좁은 경우: 너비를 기준으로 계산
            width = availableWidth;
            height = width / imageAspectRatio;
        }

        // 계산된 너비를 state에 저장
        if (width !== viewerWidth) {
            setViewerWidth(width);
        }

        return {
            width: `${width}px`,
            height: `${height}px`,
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden'
        };
    };

    return (
        <div
            className="viewer-container"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div className="viewer-header">
                <button className="back-button" onClick={() => navigate('/')}>
                    <span className="back-icon">‹</span>
                    <span>뒤로가기</span>
                </button>
                <div className="auto-play-control">
                    <span className="auto-play-label">자동 재생</span>
                    <button
                        className={`auto-play-toggle ${isAutoPlay ? 'active' : ''}`}
                        onClick={() => setIsAutoPlay(!isAutoPlay)}
                    >
                        {isAutoPlay ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>

            <div className="viewer-content" style={getViewerContentStyle()}>
                <div
                    className="slider-track"
                    style={{
                        width: `${webtoon.pages.length * viewerWidth}px`,
                        display: 'flex',
                        height: '100%',
                        transform: `translateX(${-currentPageIndex * viewerWidth + dragOffset}px)`,
                        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                    }}
                >
                    {webtoon.pages.map((page) => (
                        <div
                            className="slide"
                            key={page.id}
                            style={{
                                width: `${viewerWidth}px`,
                                minWidth: `${viewerWidth}px`,
                                height: '100%'
                            }}
                        >
                            <PageRenderer
                                imageSrc={getAssetPath(page.image)}
                                onContentClick={handleContentClick}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <AudioController
                sfxSrc={getAssetPath(currentPage.sfx)}
                dialogueSrc={currentDialogue ? getAssetPath(currentDialogue.audio) : null}
                isAutoPlay={isAutoPlay}
                onDialogueEnded={handleNext}
            />
        </div>
    );
};

export default ViewerContainer;
