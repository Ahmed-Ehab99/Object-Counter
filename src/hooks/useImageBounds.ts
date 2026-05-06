import { useEffect, useRef, useState } from "react";

export interface ImageBounds {
  offsetX: number; // left offset in px (letterbox)
  offsetY: number; // top offset in px (letterbox)
  renderedWidth: number;
  renderedHeight: number;
}

export const useImageBounds = (
  src: string | null,
): [React.RefObject<HTMLImageElement | null>, ImageBounds] => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [bounds, setBounds] = useState<ImageBounds>({
    offsetX: 0,
    offsetY: 0,
    renderedWidth: 0,
    renderedHeight: 0,
  });

  useEffect(() => {
    if (!src) return;

    const calculate = () => {
      const img = imgRef.current;
      if (!img) return;

      const containerW = img.clientWidth;
      const containerH = img.clientHeight;
      const naturalW = img.naturalWidth;
      const naturalH = img.naturalHeight;

      if (!naturalW || !naturalH) return;

      const containerRatio = containerW / containerH;
      const imageRatio = naturalW / naturalH;

      let renderedWidth: number;
      let renderedHeight: number;

      if (imageRatio > containerRatio) {
        // image is wider — constrained by width
        renderedWidth = containerW;
        renderedHeight = containerW / imageRatio;
      } else {
        // image is taller — constrained by height
        renderedHeight = containerH;
        renderedWidth = containerH * imageRatio;
      }

      setBounds({
        offsetX: (containerW - renderedWidth) / 2,
        offsetY: (containerH - renderedHeight) / 2,
        renderedWidth,
        renderedHeight,
      });
    };

    const img = imgRef.current;
    if (!img) return;

    const observer = new ResizeObserver(calculate);
    observer.observe(img);

    // Handle load inside the hook — safe, no loop risk
    img.addEventListener("load", calculate);
    if (img.complete) calculate();

    return () => {
      observer.disconnect();
      img.removeEventListener("load", calculate);
    };
  }, [src]);

  return [imgRef, bounds];
};
