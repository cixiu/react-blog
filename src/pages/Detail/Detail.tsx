import * as React from 'react'
import { connect } from 'react-redux'
import * as marked from 'marked'
import * as hljs from 'highlight.js'
import { IStoreState } from '../../store/types'

marked.setOptions({
  highlight: (code, lang, callback) => {
    return hljs.highlightAuto(code).value
  }
})

interface IProps {}
interface IReduxInjectedProps extends IProps {
  articleDetail: IStoreState['articleDetail']
}
class Detail extends React.Component {
  get injected() {
    return this.props as IReduxInjectedProps
  }

  render() {
    let content = ''
    if (this.injected.articleDetail.content) {
      content = this.injected.articleDetail.content
    }
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: marked(content)
        }}
      />
    )
  }
}

const mapStateToProps = ({ articleDetail }: IStoreState) => ({
  articleDetail
})

const mergeProps = (
  stateProps: object,
  dispatchProps: object,
  ownProps: object
) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, {}, mergeProps)(Detail)
