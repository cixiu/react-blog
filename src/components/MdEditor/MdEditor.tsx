import * as React from 'react'
// import * as SimpleMDE from 'simplemde'
// import marked from 'marked'
// import axios from 'axios'
import './index.scss'
import config, { ISimpleMDE } from './config'

interface IProps {
  onChange: (simplemde: SimpleMDE) => void
  options: SimpleMDE.Options
  value: string
  extraKeys?: string
  className?: string
  id: string
  style?: React.CSSProperties
}
interface IState {
  keyChange: boolean
  isLoading: boolean
}

class MdEditor extends React.Component<IProps, IState> {
  simplemde: ISimpleMDE
  editorEl: Element
  editorToolbarEl: Element | null
  state = {
    keyChange: false,
    isLoading: false
  }

  static getDerivedStateFromProps(nextProps: IProps) {
    return {
      keyChange: false
    }
  }

  componentDidMount() {
    this.createEditor()
    this.addEvents()
    this.addExtraKeys()
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    // console.log(this.simplemde)
    if (!this.state.keyChange && this.props.value !== this.simplemde.value()) {
      this.simplemde.value(this.props.value)
    }
  }

  // FIXME:迁移到getDerivedStateFromProps和componentDidUpdate生命周期中
  // componentWillReceiveProps(nextProps: IProps) {
  //   if (!this.state.keyChange && nextProps.value !== this.simplemde.value()) {
  //     this.simplemde.value(nextProps.value)
  //   }
  //   this.setState({
  //     keyChange: false
  //   })
  // }

  componentWillUnmount() {
    this.removeEvents()
  }

  createEditor = () => {
    // 服务端渲染中需要在componentDidMount的时候引入simplemde库 不然会报错
    const SimpleMDE = require('simplemde')
    const initialOptions = {
      element: document.getElementById(this.props.id) as HTMLElement,
      initialValue: this.props.value,
      ...config
    }
    const { options } = this.props
    const allOptions = { ...initialOptions, ...options }
    this.simplemde = new SimpleMDE(allOptions)
  }

  // TODO:点击回复后SimpleMd需要聚焦
  focus = (value: string) => {
    this.simplemde.value(value)
    this.simplemde.codemirror.setCursor({line: 0, ch: this.simplemde.value().length})
    this.simplemde.codemirror.focus()
  }

  eventWrapper = () => {
    this.setState({
      keyChange: true
    })
    this.props.onChange(this.simplemde)
  }

  addEvents = () => {
    const wrapperEl = document.getElementById(
      `${this.props.id}-wrapper`
    ) as HTMLElement

    this.editorEl = wrapperEl.getElementsByClassName('CodeMirror')[0]
    this.editorToolbarEl = wrapperEl.getElementsByClassName('editor-toolbar')[0]

    this.editorEl.addEventListener('keyup', this.eventWrapper)
    // 需要监听剪贴板paste粘贴事件 有兼容性问题
    this.editorEl.addEventListener('paste', this.eventWrapper)
    if (this.editorToolbarEl) {
      this.editorToolbarEl.addEventListener('click', this.eventWrapper)
    }
  }

  addExtraKeys = () => {
    // https://codemirror.net/doc/manual.html#option_extraKeys
    if (this.props.extraKeys) {
      this.simplemde.codemirror.setOption('extraKeys', this.props.extraKeys)
    }
  }

  removeEvents = () => {
    this.editorEl.removeEventListener('keyup', this.eventWrapper)
    this.editorEl.removeEventListener('paste', this.eventWrapper)
    if (this.editorToolbarEl) {
      this.editorToolbarEl.removeEventListener('click', this.eventWrapper)
    }
  }

  render() {
    return (
      <div id={`${this.props.id}-wrapper`} className="markdown-editor-wrapper">
        <textarea id={this.props.id} className="markdown-editor" />
        {/* <input
          className="image-file-selector"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
        /> */}
        {this.state.isLoading && (
          <div style={{ fontSize: '100px' }}>isLoading</div>
        )}
      </div>
    )
  }
}

export default MdEditor
