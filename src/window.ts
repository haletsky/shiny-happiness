import mdfn from 'markdown-it'
import { get_state, load_storage } from './storage'
import { get_focus, set_focus, is_saved } from './ui'

const md = mdfn()

const state = get_state()
const editor = document.getElementById('editor') as HTMLTextAreaElement

export function init_windows ()
{
  const initWindowFromState = ({ id, x, y, text, color, size = { width: 0, height: 0 } }) => {
    const win = create_window(x, y)
    win.onChange(text)
    win.setId(id)
    win.setColor(color)
    win.setSize(size.width, size.height)

    const state = get_state()
    state[win.getId()] = win
  }

  const _state = load_storage()
  if (_state) {
    _state.forEach((c: any) => initWindowFromState({ id: c.id, x: c.x, y: c.y, text: c.text, color: c.color, size: c.size }))
  }
}

export function create_window (x: number, y: number)
{
  let text = ''
  let id = Math.random().toString()
  const div = document.createElement('div')
  div.style.left = x + 'px'
  div.style.top = y + 'px'
  div.className = 'window'
  const header = document.createElement('div')
  header.style.backgroundColor = 'red'
  header.style.height = '40px'
  header.className = 'header'
  const closeButton = document.createElement('span')
  closeButton.innerHTML = 'x'
  closeButton.onclick = () => {
    delete state[id]
    div.remove()
    is_saved(false)
  }
  header.append(closeButton)
  div.append(header)
  const content = document.createElement('div')
  content.id = id
  content.className = 'content'
  div.append(content)
  draggble(header)
  document.getElementById('board').append(div)

  div.onmousedown = () => {
    set_focus(+id)
    editor.value = state[get_focus()].getText()

    const windows = document.getElementsByClassName('window focus')
    for (const w of windows) {
      w.className = 'window'
    }
    div.className += ' focus'
  }
  const onChange = (t) => {
    text = t
    let result = md.render(text)
    content.innerHTML = result
    is_saved(false)
  }

  const getText = () => text
  const setText = (_text: string) => { text = _text }
  const getPosition = () => ({ x: div.offsetLeft, y: div.offsetTop })
  const getSize = () => ({ width: div.offsetWidth, height: div.offsetHeight })
  const setSize = (w: number, h: number) => { div.style.width = w + 'px'; div.style.height = h + 'px' }
  const getColor = () => div.style.backgroundColor
  const setColor = (color: string) => {
    div.style.backgroundColor = color
    header.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.1), ${color}, ${color})`
  }
  const setId = (_id: string) => { id = _id }
  const getId = () => id

  return {
    getId,
    setId,
    onChange,
    getText,
    setText,
    getSize,
    setSize,
    getPosition,
    getColor,
    setColor,
  }
}

export function draggble (element: HTMLElement)
{
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0

  const elementDrag = (e: any) => {
    e = e || window.event
    e.preventDefault()
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY
    // set the element's new position:
    element.parentElement.style.top = (element.parentElement.offsetTop - pos2) + "px"
    element.parentElement.style.left = (element.parentElement.offsetLeft - pos1) + "px"
  }

  const closeDragElement = () => {
    // stop moving when mouse button is released:
    document.onmouseup = null
    document.onmousemove = null
    is_saved(false)
  }

  const drag_mouse_down = (e: MouseEvent | Event) => {
    e = e || window.event
    e.preventDefault()
    // get the mouse cursor position at startup:
    // TODO: remove any
    pos3 = (e as any).clientX
    pos4 = (e as any).clientY
    document.onmouseup = closeDragElement
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag
  }

  element.onmousedown = drag_mouse_down
}

export function launch_window (e: MouseEvent)
{
  const w = create_window(e.x, e.y)
  state[w.getId()] = w
  is_saved(false)
}
