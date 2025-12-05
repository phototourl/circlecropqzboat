'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Upload, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';

type LoadedImage = {
  url: string;
  element: HTMLImageElement;
  originalFile: File;
};

interface CircleCropToolProps {
  showHeading?: boolean;
}

export function CircleCropTool({ showHeading = true }: CircleCropToolProps) {
  const t = useTranslations('CircleCropTool');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const [loadedImage, setLoadedImage] = useState<LoadedImage | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [isCropping, setIsCropping] = useState(false);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  // 清理 Object URL
  useEffect(() => {
    return () => {
      if (loadedImage?.url) {
        URL.revokeObjectURL(loadedImage.url);
      }
    };
  }, [loadedImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      // 简单防御：只允许图片
      alert(t('errors.invalidFile'));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      // 清理上一个 URL
      if (loadedImage?.url) {
        URL.revokeObjectURL(loadedImage.url);
      }
      setLoadedImage({ url: objectUrl, element: img, originalFile: file });
      setScale(1);
      setOffsetX(0);
      setOffsetY(0);
    };
    img.src = objectUrl;
  };

  const drawCirclePreview = () => {
    const canvas = canvasRef.current;
    if (!canvas || !loadedImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { element: img } = loadedImage;
    const size = canvas.width; // 正方形画布
    const radius = size / 2;

    // 清除整个 canvas
    ctx.clearRect(0, 0, size, size);

    // 以图片的短边为基准，尽量铺满圆
    const base = Math.min(img.width, img.height);
    const drawSize = base * scale;
    const sx = (img.width - base) / 2;
    const sy = (img.height - base) / 2;
    const x = radius - drawSize / 2 + offsetX;
    const y = radius - drawSize / 2 + offsetY;

    // 绘制完整的图片（清晰显示，让用户看到完整正方形图片以便调整）
    ctx.drawImage(
      img,
      sx,
      sy,
      base,
      base,
      x,
      y,
      drawSize,
      drawSize,
    );

    // 绘制圆形边框，标识裁剪区域
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'; // 白色边框，清晰可见
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  // 绘制默认圆形预览（上传前）
  const drawDefaultCircle = () => {
    const canvas = canvasRef.current;
    if (!canvas || loadedImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const radius = size / 2;

    // 清除整个 canvas
    ctx.clearRect(0, 0, size, size);

    // 绘制一个默认的圆形占位符
    ctx.save();
    ctx.fillStyle = 'rgba(128, 128, 128, 0.1)';
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制圆形边框
    ctx.strokeStyle = 'rgba(128, 128, 128, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  // 图片、缩放或位置变化时重绘预览
  useEffect(() => {
    if (loadedImage) {
      drawCirclePreview();
    } else {
      drawDefaultCircle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedImage, scale, offsetX, offsetY]);

  // 处理鼠标/触摸事件
  const getEventPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!loadedImage) return;
    e.preventDefault();
    const pos = getEventPos(e);
    if (pos) {
      setIsDragging(true);
      setDragStart({ x: pos.x - offsetX, y: pos.y - offsetY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart || !loadedImage) return;
    e.preventDefault();
    const pos = getEventPos(e);
    if (pos) {
      setOffsetX(pos.x - dragStart.x);
      setOffsetY(pos.y - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!loadedImage) return;
    const pos = getEventPos(e);
    if (pos) {
      setIsDragging(true);
      setDragStart({ x: pos.x - offsetX, y: pos.y - offsetY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !dragStart || !loadedImage) return;
    e.preventDefault();
    const pos = getEventPos(e);
    if (pos) {
      setOffsetX(pos.x - dragStart.x);
      setOffsetY(pos.y - dragStart.y);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  // 处理鼠标滚轮缩放（在整个预览容器区域都支持，使用原生事件监听器以确保 preventDefault 生效）
  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container || !loadedImage) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      // 滚轮向上放大，向下缩小
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((prevScale) => {
        const newScale = Math.max(0.5, Math.min(2, prevScale + delta));
        return newScale;
      });
    };

    // 使用 { passive: false } 确保可以调用 preventDefault
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [loadedImage]);

  const handleDownload = () => {
    if (!loadedImage) {
      alert(t('errors.noImage'));
      return;
    }
    setIsCropping(true);
    try {
      const previewCanvas = canvasRef.current;
      if (!previewCanvas) return;

      // 先绘制预览
      drawCirclePreview();

      // 参考 circlecropimage.com：统一输出为 PNG 格式（透明背景）
      // 所有格式（JPG, PNG, WEBP, GIF）都输出为 PNG，保持透明背景
      const outputFormat = 'image/png';
      const fileExtension = 'png';

      // 创建一个新的 canvas 用于导出，确保高质量
      // 参考 circlecropimage.com：高分辨率输出，保持原始质量
      // 使用原始图片尺寸，但设置合理的范围（最小 512px，最大 4096px）
      const originalSize = Math.min(loadedImage.element.width, loadedImage.element.height);
      const exportSize = Math.max(512, Math.min(4096, originalSize));
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = exportSize;
      exportCanvas.height = exportSize;
      
      // 使用 2d context，默认支持透明通道
      const exportCtx = exportCanvas.getContext('2d', {
        alpha: true, // 确保支持透明
        willReadFrequently: false, // 优化性能
      });
      if (!exportCtx) return;

      // 设置高质量渲染
      exportCtx.imageSmoothingEnabled = true;
      exportCtx.imageSmoothingQuality = 'high';

      const { element: img } = loadedImage;
      const radius = exportSize / 2;

      // 清除 canvas，确保背景完全透明（PNG 格式）
      exportCtx.clearRect(0, 0, exportSize, exportSize);

      // 裁剪成圆形
      exportCtx.save();
      exportCtx.beginPath();
      exportCtx.arc(radius, radius, radius, 0, Math.PI * 2);
      exportCtx.closePath();
      exportCtx.clip();

      // 以图片的短边为基准，尽量铺满圆
      const base = Math.min(img.width, img.height);
      const drawSize = base * scale;

      const sx = (img.width - base) / 2;
      const sy = (img.height - base) / 2;

      // 应用偏移量（按比例缩放）
      const scaleFactor = exportSize / previewCanvas.width;
      const x = radius - (drawSize * scaleFactor) / 2 + offsetX * scaleFactor;
      const y = radius - (drawSize * scaleFactor) / 2 + offsetY * scaleFactor;

      // 高质量绘制图片
      exportCtx.drawImage(
        img,
        sx,
        sy,
        base,
        base,
        x,
        y,
        drawSize * scaleFactor,
        drawSize * scaleFactor,
      );

      exportCtx.restore();

      // 使用最高质量导出 PNG（1.0 = 无压缩）
      const dataUrl = exportCanvas.toDataURL(outputFormat, 1.0);
      const a = document.createElement('a');
      a.href = dataUrl;
      // 生成带时间戳的文件名，使用原始格式的扩展名
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      a.download = `circle-crop-${timestamp}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setIsCropping(false);
    }
  };

  return (
    <div className="space-y-8">
      {showHeading && (
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('heading.title')}
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
            {t('heading.description')}
          </p>
        </div>
      )}

      <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <label htmlFor="file-upload" className="w-full">
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden cursor-pointer"
                    onChange={handleFileChange}
                  />
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="w-full cursor-pointer bg-background hover:bg-foreground hover:text-background dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="mr-2 size-4" />
                  {t('upload.label')}
                </Button>
                </label>
                <p className="mt-2 text-xs text-muted-foreground">
                  {t('upload.description')}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t('zoom.label')}</span>
                  <span>{Math.round(scale * 100)}%</span>
                </div>
                <Slider
                  value={[scale]}
                  min={0.5}
                  max={2}
                  step={0.01}
                  onValueChange={(values) => setScale(values[0] ?? 1)}
                  disabled={!loadedImage}
                />
              </div>
            </div>

            {loadedImage && (
              <Button
                onClick={handleDownload}
                disabled={isCropping}
                size="lg"
                variant="default"
                className="w-full cursor-pointer hover:opacity-90 hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
              >
                <Download className="mr-2 size-4" />
                {isCropping ? t('download.processing') : t('download.label')}
              </Button>
            )}
          </div>

          <div className="flex flex-1 flex-col items-center gap-4">
            <div className="text-sm font-medium">{t('preview.label')}</div>
            <div
              ref={previewContainerRef}
              className="flex items-center justify-center"
            >
              <canvas
                ref={canvasRef}
                width={320}
                height={320}
                className={`h-64 w-64 border bg-muted ${
                  loadedImage ? 'rounded-lg cursor-move' : 'rounded-full'
                }`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            </div>
            {!loadedImage && (
              <p className="text-center text-xs text-muted-foreground">
                {t('preview.placeholder')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


