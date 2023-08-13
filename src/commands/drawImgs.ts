/**
 * draw count lines and return the time cost(ms)
 * @param ctx target canvas
 * @param img image to draw
 * @param drawPx draw pixel size
 * @param count line count
 */
export const drawImgs = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  drawPx: number,
  count: number
) => {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  ctx.strokeStyle = "#aaa";
  for (let i = 0; i < count; i++) {
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      Math.random() * w,
      Math.random() * h,
      drawPx,
      drawPx
    );
  }
};
