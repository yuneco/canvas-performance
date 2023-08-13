
/**
 * draw count lines and return the time cost(ms)
 * @param ctx target canvas
 * @param count line count
 */
const test01_drawLine = (ctx: CanvasRenderingContext2D, count = 1000) => {

  const w = ctx.canvas.width
  const h = ctx.canvas.height

  ctx.beginPath()
  for (let i = 0; i < count; i++) {
    ctx.moveTo(Math.random() * w, Math.random() * h)
    ctx.lineTo(Math.random() * w, Math.random() * h)
  }
  ctx.stroke()

}
