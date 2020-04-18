import { init_windows } from './window'
import { is_saved } from './ui'
import { init_tools, init_colors, init_editor } from './tool'
import { init_canvas } from './canvas'

init_canvas()
init_editor()
init_colors()
init_windows()
init_tools()
is_saved()
