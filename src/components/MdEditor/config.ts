import * as SimpleMDE from 'simplemde'
import { message } from 'antd'
import axios from 'axios'

interface IOptions extends SimpleMDE.Options {
  promptTexts?: {
    link: string
    image: string
  }
}

interface ISimpleMDE extends SimpleMDE {
  options: IOptions
  element: HTMLTextAreaElement
  markdown(text: string): void
  render(el?: HTMLElement): void
  autosave(): void
  createSideBySide(): Element
  createToolbar(items?: Array<string | SimpleMDE.ToolbarIcon>): Element
  createStatusbar(
    status?: boolean | Array<string | SimpleMDE.StatusBarItem>
  ): Element
  toggleBold(): void
  toggleItalic(): void
  toggleStrikethrough(): void
  toggleHeadingSmaller(): void
  toggleHeadingBigger(): void
  toggleHeading1(): void
  toggleHeading2(): void
  toggleHeading3(): void
  toggleCodeBlock(): void
  toggleBlockquote(): void
  toggleUnorderedList(): void
  toggleOrderedList(): void
  cleanBlock(): void
  drawLink(): void
  drawImage(): void
  drawTable(): void
  drawHorizontalRule(): void
  togglePreview(): void
  toggleSideBySide(): void
  toggleFullScreen(): void
  undo(): void
  redo(): void
  getState(): any
}

export function _replaceSelection(
  cm: any,
  active: boolean,
  startEnd: string[],
  url?: string
) {
  const reg = /editor-preview-active/
  if (reg.test(cm.getWrapperElement().lastChild.className)) {
    return
  }

  let text
  let start = startEnd[0]
  let end = startEnd[1]
  const startPoint = cm.getCursor('start')
  const endPoint = cm.getCursor('end')
  if (url) {
    end = end.replace('#url#', url)
  }
  if (active) {
    text = cm.getLine(startPoint.line)
    start = text.slice(0, startPoint.ch)
    end = text.slice(startPoint.ch)
    cm.replaceRange(start + end, {
      line: startPoint.line,
      ch: 0
    })
  } else {
    text = cm.getSelection()
    cm.replaceSelection(start + text + end)

    startPoint.ch += start.length
    if (startPoint !== endPoint) {
      endPoint.ch += start.length
    }
  }
  cm.setSelection(startPoint, endPoint)
  cm.focus()
}

const config = {
  renderingConfig: {
    singleLineBreaks: false,
    codeSyntaxHighlighting: true
  },
  insertTexts: {
    image: ['![', '](#url#)']
  },
  toolbar: [
    'bold',
    'italic',
    'heading',
    '|',
    'code',
    'quote',
    'unordered-list',
    'ordered-list',
    '|',
    'link',
    {
      name: 'image',
      action: (editor: ISimpleMDE) => {
        const parentElement = editor.element.parentElement as HTMLElement
        let fileInput = parentElement.querySelector(
          '.image-file-selector'
        ) as HTMLInputElement
        if (fileInput) {
          // 当fileInput存在时，每次重置fileInput的value值
          // 解决2次上传同一文件，因fileInput的value值相同而不会触发fileInput的change事件的问题
          fileInput.value = ''
        }
        if (!fileInput) {
          fileInput = document.createElement('input')
          fileInput.setAttribute('type', 'file')
          fileInput.setAttribute('accept', 'image/*')
          fileInput.style.display = 'none'
          fileInput.classList.add('image-file-selector')
          fileInput.addEventListener('change', async () => {
            if (fileInput.files && fileInput.files[0]) {
              const formData = new FormData()
              const imageType = fileInput.files[0].type.split('/')[1]
              formData.append('image', fileInput.files[0])
              const hide = message.loading('图片正在上传···', 0)
              const response = await axios.post('/api/admin/upload', formData)
              const res = response.data
              // 图片上传失败的反馈
              if (res.code === 1) {
                message.error(res.message)
                hide()
                return
              }
              // 无论最后上传是否成功 都要将提示信息隐藏
              hide()
              const cm = editor.codemirror
              const stat = editor.getState()
              const options = editor.options
              let url = res.image.url
              // 如果上传的时gif图片 则返回图片瘦身的url图片样式
              if (imageType.toUpperCase() === 'GIF') {
                const imageslim = '?imageslim'
                url += imageslim
              } else {
                // 否则返回的应该是指定宽高裁剪缩略图的url图片样式
                const imageView460x316 =
                  '?imageView2/1/w/460/h/316/format/jpg/interlace/1/q/85'
                url += imageView460x316
              }
              if (options.promptURLs) {
                url = options.promptTexts && prompt(options.promptTexts.image)
                if (!url) {
                  return false
                }
              }
              if (options.insertTexts) {
                if (options.insertTexts.image) {
                  _replaceSelection(
                    cm,
                    stat.image,
                    options.insertTexts.image,
                    url
                  )
                }
              }
              // 将图片url插入编辑区域后并不会触发编辑区域的value的Change, 所以需要手动触发
              // 主动点击editor-toolbar触发value的onChange
              const toolbarElement = parentElement.querySelector(
                '.editor-toolbar'
              ) as HTMLElement
              toolbarElement.click()
            }
            return
          })
          parentElement.appendChild(fileInput)
        }
        fileInput.click()
      },
      className: 'fa fa-picture-o',
      title: 'Insert Image'
    },
    'table',
    '|',
    'preview',
    'side-by-side',
    'fullscreen',
    '|',
    'guide'
  ]
}

let id = 0

export const generateId = () => {
  id += 1
  return `markdown-editor-${id}`
}

export { ISimpleMDE }

export default config
