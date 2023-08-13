
/**
 * draw count lines and return the time cost(ms)
 * @param ctx target canvas
 * @param count line count
 */
export const fillCircle = (ctx: CanvasRenderingContext2D,size: number, count: number) => {

  const w = ctx.canvas.width
  const h = ctx.canvas.height

  ctx.strokeStyle = "#aaa"
  for (let i = 0; i < count; i++) {
    ctx.beginPath()
    ctx.fillStyle = i % 2 === 0 ? '#fff' : '#ccc'
    ctx.arc(Math.random() * w, Math.random() * h, size / 2, 0, Math.PI * 2)
    ctx.fill()
  }

}
