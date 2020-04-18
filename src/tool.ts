import { drop_focus, is_saved } from './ui'
import { save_storage, get_state } from './storage'
import { get_focus } from './ui'
import { clean_background, background } from './canvas'

export enum Colors {
  BLACK = 'black',
  WHITE = 'white',
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
  YELLOW = 'yellow',
  PINK = 'pink',
  ORANGE = 'orange'
}

export enum Tools {
  NONE = 'none',
  NOTE = 'note',
  PEN = 'pen',
  BRUSH = 'brush',
  ERASER = 'eraser',
  TEXT = 'text',
  CLEAR = 'clear',
  SAVE = 'save',
}

let currentColor = 'black'
let currentTool = Tools.NONE
const c = document.getElementById('canvas') as HTMLCanvasElement
const ctx = c.getContext('2d')
const state = get_state()

export function init_editor ()
{
  const editor = document.getElementById('editor') as HTMLTextAreaElement
  editor.oninput = (e: TextEvent) => {
    const window = state[get_focus()]
    const t = (e.target as HTMLTextAreaElement).value

    if (window) {
      window.onChange(t)
      is_saved(false)
    }
  }
}

export function init_tools ()
{
  (document.getElementById('clean') as HTMLButtonElement).onclick = clean_background;
  (document.getElementById('squares') as HTMLButtonElement).onclick = background;

  Object.values(Tools).forEach(t => {
    if (t === Tools.NONE) return

    const el = document.getElementById(t) as HTMLButtonElement
    el.onclick = pick_tool.bind(null, t)
  })
}

export function init_colors ()
{
  const colors = Object.values(Colors)
  const divcolors = document.getElementsByClassName('color') as HTMLCollectionOf<HTMLDivElement>
  for (let i = 0; i < divcolors.length; i++) {
    const c = divcolors[i]
    c.style.backgroundColor = colors[i]
    c.onclick = () => {
    ctx.fillStyle = colors[i]
    ctx.strokeStyle = colors[i]
      set_color(colors[i])
      if (state[get_focus()]) {
        state[get_focus()].setColor(colors[i])
      }
      const divcolors = document.getElementsByClassName('color') as HTMLCollectionOf<HTMLDivElement>
      for (const d of divcolors) {
        d.style.border = ''
      }
      c.style.border = '2px solid black'
    }
  }
}

export function get_current_tool ()
{
  return currentTool
}

export function set_current_tool (t: Tools)
{
  currentTool = t
}

export function pick_tool (tool: Tools)
{
  const tools = document.querySelectorAll('button')
  for (const t of tools) {
    t.className = ''
    if (t.id === tool) {
      t.className = 'focus'
    }
  }

  set_current_tool(tool)

  drop_focus()
  switch (tool) {
    case Tools.ERASER:
      ctx.globalCompositeOperation="destination-out"
      ctx.lineWidth = 20
      break
    case Tools.PEN:
      ctx.globalCompositeOperation="source-over"
      ctx.strokeStyle = currentColor
      ctx.lineWidth = 3
      break
    case Tools.BRUSH:
      ctx.globalCompositeOperation="source-over"
      ctx.fillStyle = currentColor
      ctx.strokeStyle = currentColor
      ctx.lineWidth = 15
      break
    case Tools.TEXT:
      ctx.globalCompositeOperation="source-over"
      ctx.fillStyle = currentColor
      const e = document.getElementById('editor') as HTMLTextAreaElement
      e.value = ''
      e.focus()
      break
    case Tools.CLEAR:
      ctx.clearRect(0,0,c.offsetWidth,c.offsetHeight)
      is_saved()
      break
    case Tools.SAVE:
      save_storage()
      is_saved()
  }
}

export function set_color (c: Colors)
{
  currentColor = c
}
