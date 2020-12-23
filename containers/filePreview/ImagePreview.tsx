import React, { useState, useRef, useEffect } from 'react';
import { c } from 'ttag';
import ZoomControl from './ZoomControl';
import useElementRect from '../../hooks/useElementRect';
import UnsupportedPreview from './UnsupportedPreview';

interface Props {
    mimeType: string;
    onSave?: () => void;
    contents?: Uint8Array | Uint8Array[];
}

const ImagePreview = ({ mimeType, contents, onSave }: Props) => {
    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const containerBounds = useElementRect(containerRef);
    const [error, setError] = useState(false);
    const [scale, setScale] = useState(0);
    const [imageData, setImageData] = useState({
        src: '',
    });

    useEffect(() => {
        let src: string;

        if (error) {
            setError(false);
        }

        if (!contents) {
            return;
        }

        const blob = new Blob(Array.isArray(contents) ? contents : [contents], { type: mimeType });
        setImageData({
            src: URL.createObjectURL(blob),
        });

        return () => {
            if (src) {
                URL.revokeObjectURL(src);
            }
        };
    }, [contents, mimeType]);

    const handleZoomOut = () => setScale((zoom) => (zoom ? zoom * 0.9 : 1));
    const handleZoomIn = () => setScale((zoom) => (zoom ? zoom * 1.1 : 1));
    const fitToContainer = () => {
        if (!imageRef.current || !containerBounds) {
            return;
        }

        const heightRatio = containerBounds.height / imageRef.current.naturalHeight;
        const widthRatio = containerBounds.width / imageRef.current.naturalWidth;

        const scale = Math.min(1, heightRatio, widthRatio);

        setScale(scale);
    };

    const handleBrokenImage = () => {
        if (!error) {
            setError(true);
        }
    };

    return (
        <>
            <div ref={containerRef} className="pd-file-preview-container">
                {error ? (
                    <UnsupportedPreview onSave={onSave} type="image" />
                ) : (
                    imageData.src && (
                        <img
                            ref={imageRef}
                            onLoad={() => fitToContainer()}
                            onError={handleBrokenImage}
                            className="pd-file-preview-image"
                            style={{
                                height: imageRef.current ? imageRef.current.naturalHeight * scale : undefined,
                                width: imageRef.current ? imageRef.current.naturalWidth * scale : undefined,
                            }}
                            src={imageData.src}
                            alt={c('Info').t`Preview`}
                        />
                    )
                )}
            </div>
            {!error && (
                <ZoomControl onReset={fitToContainer} scale={scale} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
            )}
        </>
    );
};

export default ImagePreview;
