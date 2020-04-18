import { is_saved } from './ui'
import { get_current_tool, Tools, set_current_tool } from './tool'
import { launch_window } from './window'

export function init_canvas ()
{
  const c = document.getElementById('canvas') as HTMLCanvasElement
  const board = document.getElementById('board') as HTMLDivElement
  c.width = board.clientWidth
  c.height = board.clientHeight
  const ctx = c.getContext('2d')
  ctx.font = '30pt Times New Roman'
  // ctx.fontStyle = 'black'

  let lastX = 0, lastY = 0
  const penHandler = (e: MouseEvent) => {
    if (e.buttons === 1) {
      console.log('draw')
      draw_line(ctx, lastX - 300, lastY, e.x - 300, e.y)
      is_saved(false)
    }
  }
  const brushHandler = (e: MouseEvent) => {
    if (e.buttons === 1) {
      draw_line(ctx, lastX - 300, lastY, e.x - 300, e.y)
      ctx.beginPath()
      ctx.ellipse(e.x - 300, e.y, ctx.lineWidth/2, ctx.lineWidth/2, 0, 0, 180)
      ctx.fill()
      ctx.closePath()
      is_saved(false)
    }
  }
  c.onmousemove = (e: MouseEvent) => {
    switch(get_current_tool()) {
      case Tools.PEN:
        penHandler(e)
        break
      case Tools.ERASER:
      case Tools.BRUSH:
        brushHandler(e)
        break
    }
    lastX = e.x
    lastY = e.y
  }
  c.onclick = (e: MouseEvent) => {
    switch(get_current_tool()) {
      case 'note':
        launch_window(e)
        is_saved(false)
        break
      case 'text':
        const { value } = document.getElementById('editor') as HTMLTextAreaElement
        ctx.fillText(value, e.x - 300, e.y)
        set_current_tool(Tools.NONE)
        is_saved(false)
        break
    }
  }
}

export function clean_background()
{
  const c = document.getElementById('canvas') as HTMLCanvasElement
  c.style.backgroundImage = 'none'
}

export function background()
{
  const c = document.getElementById('canvas') as HTMLCanvasElement
  const ctx = c.getContext('2d')
  const imageDataBackup = ctx.getImageData(0,0,c.offsetWidth, c.offsetHeight)
  ctx.clearRect(0,0,c.offsetWidth, c.offsetHeight)
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 0.25

  for (let i = 0; i < c.width; i+=25) {
    draw_line(ctx, i, 0, i, c.height)
  }

  for (let i = 0; i < c.height; i+=25) {
    draw_line(ctx, 0, i, c.width, i)
  }

  const backgroundImageData = c.toDataURL()
  ctx.clearRect(0,0,c.offsetWidth, c.offsetHeight)
  const i = new Image
  i.src = backgroundImageData
  i.onload = () => {
    c.style.backgroundImage = `url('${backgroundImageData}')`
  }
  ctx.putImageData(imageDataBackup, 0,0)
}

export function draw_line (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number)
{
  if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) {
    return
  }

  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  ctx.closePath()
}
