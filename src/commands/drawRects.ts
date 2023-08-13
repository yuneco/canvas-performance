
/**
 * draw count lines and return the time cost(ms)
 * @param ctx target canvas
 * @param count line count
 */
export const fillRects = (ctx: CanvasRenderingContext2D,size = 100, count = 1000) => {

  const w = ctx.canvas.width
  const h = ctx.canvas.height

  ctx.strokeStyle = "#aaa"
  for (let i = 0; i < count; i++) {
    ctx.beginPath()
    ctx.fillStyle = i % 2 === 0 ? '#fff' : '#ccc'
    ctx.rect(Math.random() * w, Math.random() * h, size, size)
    ctx.fill()
  }
}
