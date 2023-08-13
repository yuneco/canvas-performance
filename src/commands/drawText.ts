
/**
 * draw count lines and return the time cost(ms)
 * @param ctx target canvas
 * @param count line count
 */
export const drawText = (ctx: CanvasRenderingContext2D,size: number, text: string, count: number) => {

  const w = ctx.canvas.width
  const h = ctx.canvas.height

  ctx.strokeStyle = "#aaa"
  for (let i = 0; i < count; i++) {
    ctx.beginPath()
    ctx.font = `${size}px san-serif`
    ctx.fillStyle = i % 2 === 0 ? '#999' : '#ccc'
    ctx.fillText(text, Math.random() * w, Math.random() * h, 300)
    ctx.fill()
  }

}
