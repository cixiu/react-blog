import * as SimpleMDE from 'simplemde'
import axios from 'axios'

interface IOptions extends SimpleMDE.Options {
  promptTexts?: {
    link: string
    image: string
  }
}

interface ISimpleMDE extends SimpleMDE {
  options: IOptions
  markdown(text: string): void
  render(el: HTMLElement): void
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

function _replaceSelection(
  cm: any,
  active: boolean,
  startEnd: string[],
  url: string
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

let isListener = false

const config = {
  renderingConfig: {
    singleLineBreaks: false,
    codeSyntaxHighlighting: true
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
        const fileInput = document.querySelector(
          '.image-file-selector'
        ) as HTMLInputElement
        if (!isListener) {
          isListener = true
          fileInput.addEventListener('change', async () => {
            const formData = new FormData()
            if (fileInput.files && fileInput.files[0]) {
              console.log(fileInput.files)
              formData.append('image', fileInput.files[0])
              const res = await axios.post('/api/admin/upload', formData)
              const cm = editor.codemirror
              const stat = editor.getState()
              const options = editor.options
              let url = res.data.image.url
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
            }
            return
          })
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

export default config