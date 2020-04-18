import { compress, decompress } from 'lz-string'

interface State extends Array<StateItem> { }
interface StateItem {
  id: number,
  text: string,
  color: string,
  x: number,
  y: number,
  size: {
    width: number,
    height: number
  }
}

const state = { }

export function get_state ()
{
  return state
}

export function save_storage ()
{
  const c = document.getElementById('canvas') as HTMLCanvasElement

  window.localStorage.setItem('canvas', c.toDataURL())
  window.localStorage.setItem('state', JSON.stringify(
    Object.keys(state).map(k => ({
      id: k,
      text: compress(state[k.toString()].getText()),
      color: state[k.toString()].getColor(),
      size: state[k.toString()].getSize(),
      ...state[k.toString()].getPosition(),
    }))))
}

export function load_storage ()
{
  const canvas = window.localStorage.getItem('canvas')
  const _state = window.localStorage.getItem('state')

  if (canvas) {
    const i = new Image
    i.src = canvas
    i.onload = function(){
      const c = document.getElementById('canvas') as HTMLCanvasElement
      const ctx = c.getContext('2d')
      ctx.drawImage(i,0,0)
    }
  }

  return _state && (JSON.parse(_state) as State).map(i => ({ ...i, text: decompress(i.text) }));
}
