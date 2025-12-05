import React, { useEffect, useRef } from 'react';

const AudioController = ({
    sfxSrc,
    dialogueSrc,
    isAutoPlay,
    onDialogueEnded
}) => {
    const sfxRef = useRef(null);
    const dialogueRef = useRef(null);

    // SFX Playback
    useEffect(() => {
        if (sfxSrc) {
            console.log('Playing SFX:', sfxSrc);
            const audio = new Audio(sfxSrc);
            sfxRef.current = audio;

            // 재생 시도
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => console.log("SFX Play failed:", e));
            }
        }

        return () => {
            if (sfxRef.current) {
                // pause() 호출 전에 재생 중인지 확인
                try {
                    sfxRef.current.pause();
                    sfxRef.current.currentTime = 0;
                } catch (e) {
                    // 이미 정리된 경우 무시
                }
                sfxRef.current = null;
            }
        };
    }, [sfxSrc]);

    // Dialogue Playback
    useEffect(() => {
        if (dialogueSrc) {
            console.log('Playing Dialogue:', dialogueSrc);
            const audio = new Audio(dialogueSrc);
            dialogueRef.current = audio;

            // onended 핸들러 먼저 설정
            audio.onended = () => {
                if (isAutoPlay && onDialogueEnded) {
                    onDialogueEnded();
                }
            };

            // 재생 시도
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    // AbortError는 무시 (빠른 페이지 전환 시 정상)
                    if (e.name !== 'AbortError') {
                        console.log("Dialogue Play failed:", e);
                    }
                });
            }
        } else {
            console.log('No dialogue to play');
        }

        return () => {
            if (dialogueRef.current) {
                try {
                    // 재생 중인 오디오만 pause 호출
                    if (!dialogueRef.current.paused) {
                        dialogueRef.current.pause();
                    }
                    dialogueRef.current.currentTime = 0;
                } catch (e) {
                    // 이미 정리된 경우 무시
                }
                dialogueRef.current = null;
            }
        };
    }, [dialogueSrc, isAutoPlay, onDialogueEnded]);

    return null; // This component does not render anything visual
};

export default AudioController;
