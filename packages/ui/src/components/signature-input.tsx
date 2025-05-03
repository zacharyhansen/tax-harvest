'use client';

import { Eraser } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from './button';

type SignatureInputProps = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onSignatureChange: (signature: string | null) => void;
};

function preventScroll(event: TouchEvent) {
  event.preventDefault(); // Disable scroll
}

function disableTouchScroll(canvas: HTMLCanvasElement) {
  canvas.addEventListener('touchstart', preventScroll, { passive: false });
  canvas.addEventListener('touchmove', preventScroll, { passive: false });
  canvas.addEventListener('touchend', preventScroll, { passive: false });

  return () => {
    canvas.removeEventListener('touchstart', preventScroll);
    canvas.removeEventListener('touchmove', preventScroll);
    canvas.removeEventListener('touchend', preventScroll);
  };
}

const SCALE = 10;

export function SignatureInput({
  canvasRef,
  onSignatureChange,
}: Readonly<SignatureInputProps>) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        const width = 440;
        const height = 220;
        // scaling the canvas for better image quality but
        canvas.width = width * SCALE;
        canvas.height = height * SCALE;
        // keeping display size of the canvas the same
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.scale(SCALE, SCALE);

        context.lineWidth = 2;
        context.lineCap = 'round';
        context.strokeStyle = 'black';
      }
      // removing scroll behavior on touch screens, while drawing
      return disableTouchScroll(canvas);
    }
  }, [canvasRef]);

  const startDrawing = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    event.preventDefault();
    setIsDrawing(true);
    // eslint-disable-next-line ts/no-use-before-define
    draw(event);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPosition(null);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (canvas && context) {
      context.beginPath();
      const dataUrl = canvas.toDataURL();
      onSignatureChange(dataUrl); // Pass data URL to the form's onChange
    }
  };

  const draw = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    event.preventDefault();
    if (!isDrawing) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (canvas && context) {
      const rect = canvas.getBoundingClientRect();
      const x
        = ('touches' in event
          ? (event.touches[0]?.clientX ?? 0)
          : event.clientX) - rect.left;
      const y
        = ('touches' in event
          ? (event.touches[0]?.clientY ?? 0)
          : event.clientY) - rect.top;

      if (lastPosition) {
        const midX = (lastPosition.x + x) / 2;
        const midY = (lastPosition.y + y) / 2;

        context.beginPath();
        context.moveTo(lastPosition.x, lastPosition.y);
        context.quadraticCurveTo(midX, midY, x, y); // Smooth transition
        context.stroke();
      } else {
        // For the first point, simply move to the position without a stroke
        context.beginPath();
        context.moveTo(x, y);
      }

      setLastPosition({ x, y });
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      onSignatureChange(null); // Clear signature in the form as well
    }
  };

  return (
    <div className="relative h-[200px] w-[400px] overflow-hidden rounded-lg border border-gray-300">
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className="w-full"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onBlur={stopDrawing}
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchEnd={stopDrawing}
        onTouchMove={draw}
      />
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="absolute bottom-1 left-1 z-10 rounded-full"
        onClick={clearSignature}
      >
        <Eraser className="size-4 text-muted-foreground hover:text-primary" />
      </Button>
    </div>
  );
}
