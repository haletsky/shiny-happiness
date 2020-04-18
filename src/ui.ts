let focusId = 0

export function get_focus ()
{
  return focusId
}

export function set_focus (id: number)
{
  focusId = id
}

export function is_saved (flag = true)
{
  const e = document.getElementById('saved')
  e.innerHTML = flag ? 'Saved: ✔' : 'Saved: ❌'
}

export function drop_focus ()
{
  set_focus(0)
  const windows = document.getElementsByClassName('window focus')
  for (const w of windows) {
    w.className = 'window'
  }
}
