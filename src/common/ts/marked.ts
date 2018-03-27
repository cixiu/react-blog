import * as marked from 'marked'

interface IRenderer extends marked.Renderer {
  options: marked.MarkedOptions
}

const renderer = new marked.Renderer() as IRenderer

// 代理marked下的Renderer类下的render方法
renderer.heading = function(text, level, raw) {
  return `<h${level} class="heading">${text}</h${level}>`
}

interface IWindow extends Window {
  hljs: any
}
declare const window: IWindow

marked.setOptions({
  renderer,
  xhtml: true,
  highlight(code) {
    return  window.hljs.highlightAuto(code).value;
  }
})

export default marked
