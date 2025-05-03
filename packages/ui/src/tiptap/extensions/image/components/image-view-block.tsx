import type { NodeViewProps } from '@tiptap/react';
import type { ElementDimensions } from '../hooks/use-drag-resize';
import type { UploadReturnType } from '../image';
import { InfoCircledIcon, TrashIcon } from '@radix-ui/react-icons';

import { cn } from '@repo/ui/utils';
import { NodeViewWrapper } from '@tiptap/react';
import * as React from 'react';
import { Controlled as ControlledZoom } from 'react-medium-image-zoom';
import { Spinner } from '../../../components/spinner';
import { blobUrlToBase64, randomId } from '../../../utils';
import { useDragResize } from '../hooks/use-drag-resize';

import { useImageActions } from '../hooks/use-image-actions';
import { ActionButton, ActionWrapper, ImageActions } from './image-actions';
import { ImageOverlay } from './image-overlay';

import { ResizeHandle } from './resize-handle';

const MAX_HEIGHT = 600;
const MIN_HEIGHT = 120;
const MIN_WIDTH = 120;

type ImageState = {
  src: string;
  isServerUploading: boolean;
  imageLoaded: boolean;
  isZoomed: boolean;
  error: boolean;
  naturalSize: ElementDimensions;
};

function normalizeUploadResponse(response: UploadReturnType) {
  return {
    src: typeof response === 'string' ? response : response.src,
    id: typeof response === 'string' ? randomId() : response.id,
  };
}

export const ImageViewBlock: React.FC<NodeViewProps> = ({
  editor,
  node,
  selected,
  updateAttributes,
}) => {
  const {
    src: initialSource,
    width: initialWidth,
    height: initialHeight,
    fileName,
  } = node.attrs;
  const uploadAttemptedReference = React.useRef(false);

  const initSource = React.useMemo(() => {
    if (typeof initialSource === 'string') {
      return initialSource;
    }
    return initialSource.src;
  }, [initialSource]);

  const [imageState, setImageState] = React.useState<ImageState>({
    src: initSource,
    isServerUploading: false,
    imageLoaded: false,
    isZoomed: false,
    error: false,
    naturalSize: { width: initialWidth, height: initialHeight },
  });

  const containerReference = React.useRef<HTMLDivElement>(null);
  const [activeResizeHandle, setActiveResizeHandle] = React.useState<
    'left' | 'right' | null
  >(null);

  const onDimensionsChange = React.useCallback(
    ({ width, height }: ElementDimensions) => {
      updateAttributes({ width, height });
    },
    [updateAttributes],
  );

  const aspectRatio
    = imageState.naturalSize.width / imageState.naturalSize.height;
  const maxWidth = MAX_HEIGHT * aspectRatio;
  const containerMaxWidth = containerReference.current
    ? Number.parseFloat(
        getComputedStyle(containerReference.current).getPropertyValue(
          '--editor-width',
        ),
      )
    : Infinity;

  const { isLink, onView, onDownload, onCopy, onCopyLink, onRemoveImg }
    = useImageActions({
      editor,
      node,
      src: imageState.src,
      onViewClick: (isZoomed) => {
        setImageState(previous => ({ ...previous, isZoomed }));
      },
    });

  const {
    currentWidth,
    currentHeight,
    updateDimensions,
    initiateResize,
    isResizing,
  } = useDragResize({
    initialWidth: initialWidth ?? imageState.naturalSize.width,
    initialHeight: initialHeight ?? imageState.naturalSize.height,
    contentWidth: imageState.naturalSize.width,
    contentHeight: imageState.naturalSize.height,
    gridInterval: 0.1,
    onDimensionsChange,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    maxWidth: containerMaxWidth > 0 ? containerMaxWidth : maxWidth,
  });

  const shouldMerge = React.useMemo(() => currentWidth <= 180, [currentWidth]);

  const handleImageLoad = React.useCallback(
    (event_: React.SyntheticEvent<HTMLImageElement>) => {
      const img = event_.target as HTMLImageElement;
      const newNaturalSize = {
        width: img.naturalWidth,
        height: img.naturalHeight,
      };
      setImageState(previous => ({
        ...previous,
        naturalSize: newNaturalSize,
        imageLoaded: true,
      }));
      updateAttributes({
        width: img.width || newNaturalSize.width,
        height: img.height || newNaturalSize.height,
        alt: img.alt,
        title: img.title,
      });

      if (!initialWidth) {
        updateDimensions(state => ({ ...state, width: newNaturalSize.width }));
      }
    },
    [initialWidth, updateAttributes, updateDimensions],
  );

  const handleImageError = React.useCallback(() => {
    setImageState(previous => ({
      ...previous,
      error: true,
      imageLoaded: true,
    }));
  }, []);

  const handleResizeStart = React.useCallback(
    (direction: 'left' | 'right') =>
      (event: React.PointerEvent<HTMLDivElement>) => {
        setActiveResizeHandle(direction);
        initiateResize(direction)(event);
      },
    [initiateResize],
  );

  const handleResizeEnd = React.useCallback(() => {
    setActiveResizeHandle(null);
  }, []);

  React.useEffect(() => {
    if (!isResizing) {
      handleResizeEnd();
    }
  }, [isResizing, handleResizeEnd]);

  React.useEffect(() => {
    const handleImage = async () => {
      if (!initSource.startsWith('blob:') || uploadAttemptedReference.current) {
        return;
      }

      uploadAttemptedReference.current = true;
      const imageExtension = editor.options.extensions.find(
        extension => extension.name === 'image',
      );
      const { uploadFn } = imageExtension?.options ?? {};

      if (!uploadFn) {
        try {
          const base64 = await blobUrlToBase64(initSource);
          setImageState(previous => ({ ...previous, src: base64 }));
          updateAttributes({ src: base64 });
        } catch {
          setImageState(previous => ({ ...previous, error: true }));
        }
        return;
      }

      try {
        setImageState(previous => ({ ...previous, isServerUploading: true }));
        const response = await fetch(initSource);
        const blob = await response.blob();
        const file = new File([blob], fileName, { type: blob.type });

        const url = await uploadFn(file, editor);
        const normalizedData = normalizeUploadResponse(url);

        setImageState(previous => ({
          ...previous,
          ...normalizedData,
          isServerUploading: false,
        }));

        updateAttributes(normalizedData);
      } catch {
        setImageState(previous => ({
          ...previous,
          error: true,
          isServerUploading: false,
        }));
      }
    };

    handleImage().catch((error) => {
      console.error(error);
    });
  }, [editor, fileName, initSource, updateAttributes]);

  return (
    <NodeViewWrapper
      ref={containerReference}
      data-drag-handle
      className="relative text-center leading-none"
    >
      <div
        className="group/node-image relative mx-auto rounded-lg object-contain"
        style={{
          maxWidth: `min(${maxWidth}px, 100%)`,
          width: currentWidth,
          maxHeight: MAX_HEIGHT,
          aspectRatio: `${imageState.naturalSize.width} / ${imageState.naturalSize.height}`,
        }}
      >
        <div
          className={cn(
            'relative flex h-full cursor-default flex-col items-center gap-2 rounded',
            {
              'outline-primary outline outline-2 outline-offset-1':
                selected || isResizing,
            },
          )}
        >
          <div className="h-full contain-paint">
            <div className="relative h-full">
              {imageState.isServerUploading && !imageState.error && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Spinner className="size-7" />
                </div>
              )}

              {imageState.error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <InfoCircledIcon className="size-8 text-destructive" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Failed to load image
                  </p>
                </div>
              )}

              <ControlledZoom
                isZoomed={imageState.isZoomed}
                onZoomChange={() => {
                  setImageState(previous => ({ ...previous, isZoomed: false }));
                }}
              >
                <img
                  className={cn(
                    'h-auto rounded object-contain transition-shadow',
                    {
                      'opacity-0': !imageState.imageLoaded || imageState.error,
                    },
                  )}
                  style={{
                    maxWidth: `min(100%, ${maxWidth}px)`,
                    minWidth: `${MIN_WIDTH}px`,
                    maxHeight: MAX_HEIGHT,
                  }}
                  width={currentWidth}
                  height={currentHeight}
                  src={imageState.src}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  alt={node.attrs.alt || ''}
                  title={node.attrs.title || ''}
                  id={node.attrs.id}
                />
              </ControlledZoom>
            </div>

            {imageState.isServerUploading && <ImageOverlay />}

            {editor.isEditable
              && imageState.imageLoaded
              && !imageState.error
              && !imageState.isServerUploading && (
              <>
                <ResizeHandle
                  onPointerDown={handleResizeStart('left')}
                  className={cn('left-1', {
                    hidden: isResizing && activeResizeHandle === 'right',
                  })}
                  isResizing={isResizing && activeResizeHandle === 'left'}
                />
                <ResizeHandle
                  onPointerDown={handleResizeStart('right')}
                  className={cn('right-1', {
                    hidden: isResizing && activeResizeHandle === 'left',
                  })}
                  isResizing={isResizing && activeResizeHandle === 'right'}
                />
              </>
            )}
          </div>

          {imageState.error && (
            <ActionWrapper>
              <ActionButton
                icon={<TrashIcon className="size-4" />}
                tooltip="Remove image"
                onClick={onRemoveImg}
              />
            </ActionWrapper>
          )}

          {!isResizing
            && !imageState.error
            && !imageState.isServerUploading && (
            <ImageActions
              shouldMerge={shouldMerge}
              isLink={isLink}
              onView={onView}
              onDownload={onDownload}
              onCopy={onCopy}
              onCopyLink={onCopyLink}
            />
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};
