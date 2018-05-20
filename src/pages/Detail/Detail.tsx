import * as React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { Avatar, Button, message } from 'antd'
import * as dateFormat from 'dateformat'
import { CSSTransition, Transition } from 'react-transition-group'
import marked from '../../common/ts/marked'
import CommentsList from '../../components/CommentsList/CommentsList'
import MdEditor from '../../components/MdEditor/MdEditor'
import { SkeletonLoading } from '../../components/Loading/Loading'
import { createComment, getArticleComments } from '../../api/comments'
import {
  IStoreState,
  IUserInfo,
  IArticleDetail,
  IComment
} from '../../store/types'

import * as styles from '../../styles/Detail/Detail.scss'

// const { TextArea } = Input

interface IState {
  showComments: boolean
  comments: IComment[]
  comment: string
  count: number
  showBigImage: boolean
  bigImageSrc: string
  naturalWidth: number
  naturalHeight: number
  smallImgRect: DOMRect | ClientRect
}

interface IProps {}
interface IReduxInjectedProps extends IProps {
  articleDetail: IArticleDetail
  isLoading: boolean
  userId: number
  userInfo: IUserInfo
}
class Detail extends React.Component<IProps, IState> {
  // bigImageRef = React.createRef<HTMLImageElement>()
  state: IState = {
    showComments: false,
    comments: [],
    comment: '',
    count: 0,
    showBigImage: false,
    bigImageSrc: '',
    naturalWidth: 0,
    naturalHeight: 0,
    smallImgRect: {} as DOMRect
  }
  get injected() {
    return this.props as IReduxInjectedProps
  }

  // TODO:点击图片放大
  async componentDidMount() {
    // 监听图片的点击事件
    window.addEventListener('click', this.listenImgClick)
    window.addEventListener('scroll', this.listenScroll)
    const { articleDetail, userId } = this.injected
    const res = await getArticleComments(articleDetail.id, userId)
    if (res.code === 0 && res.data.count) {
      this.setState({
        comments: res.data.comments,
        showComments: true,
        count: res.data.count
      })
    }
  }

  // 组件卸载的时候要移除事件的监听
  componentWillUnmount() {
    window.removeEventListener('click', this.listenImgClick)
    window.removeEventListener('scroll', this.listenScroll)
  }

  listenImgClick = (ev: any) => {
    const target: HTMLImageElement = ev.target || ev.srcElement
    if (target.nodeName === 'IMG' && !this.state.showBigImage) {
      // 使用client宽高在移动端和pc断切换时为0，所以需要将原生natural宽高储存
      const bigImageSrc = target.src.replace(/\?.+/, '?imageslim')
      const image = new Image()
      image.onload = () => {
        this.setState({
          showBigImage: true,
          bigImageSrc,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          smallImgRect: target.getBoundingClientRect()
        })
      }
      image.src = bigImageSrc
    } else {
      this.setState({
        showBigImage: false,
        // bigImageSrc: '',
        naturalWidth: 0,
        naturalHeight: 0
      })
    }
  }
  // 监听滚动，图片放大时，scroll事件触发则需要将图片缩小
  listenScroll = (ev: any) => {
    if (this.state.showBigImage) {
      this.setState({ showBigImage: false })
    }
  }

  changeValue = (simplemde: SimpleMDE) => {
    this.setState({ comment: simplemde.value() })
  }

  supportComment = (comments: IComment[], needChangeCount = false) => {
    if (needChangeCount) {
      this.setState(prevState => ({
        count: prevState.count + 1
      }))
    }
    this.setState({ comments })
  }

  submitComment = async () => {
    if (!this.state.comment) {
      message.info('请先写点什么再进行评论')
      return
    }
    const articleId = this.injected.articleDetail.id
    const userId = this.injected.userId
    const content = marked(this.state.comment)
    if (!userId) {
      message.info('请先注册登录，再进行评论~~')
      return
    }
    const res = await createComment(articleId, { userId, content })
    if (res.code === 0) {
      this.setState(prevState => {
        return {
          comments: prevState.comments.concat(res.data),
          comment: '',
          showComments: true,
          count: prevState.count + 1
        }
      })
      message.success('评论成功')
    } else {
      message.error('评论失败')
    }
  }

  setEnteringStyle = (el: HTMLImageElement) => {
    const { naturalWidth, naturalHeight } = this.state
    const { innerWidth, innerHeight } = window
    const clientScale = naturalWidth / naturalHeight
    const innerScale = innerWidth / innerHeight
    // 大图的宽高和定位需要通过图片natural宽高和屏幕视口计算而来的
    let width!: number
    let height!: number
    let top!: number
    let left!: number
    // 图片宽高都小于可视区宽高
    if (naturalWidth < innerWidth && naturalHeight < innerHeight) {
      width = naturalWidth
      height = naturalHeight
      top = (innerHeight - height) / 2
      left = (innerWidth - width) / 2
    }
    // 图片宽高都大于可视区宽高
    if (naturalWidth > innerWidth && naturalHeight > innerHeight) {
      if (clientScale < innerScale) {
        width = innerHeight * clientScale
        height = innerHeight
        top = 0
        left = (innerWidth - width) / 2
      } else {
        width = innerWidth
        height = innerWidth / clientScale
        top = (innerHeight - height) / 2
        left = 0
      }
    }
    // 图片宽大于可视区宽 图片高小于可视区宽高
    if (naturalWidth > innerWidth && naturalHeight < innerHeight) {
      width = innerWidth
      height = innerWidth / clientScale
      top = (innerHeight - height) / 2
      left = 0
    }
    // 图片宽小于可视区宽 图片高大于可视区宽高
    if (naturalWidth < innerWidth && naturalHeight > innerHeight) {
      width = innerHeight * clientScale
      height = innerHeight
      top = 0
      left = (innerWidth - width) / 2
    }
    el.style.width = `${width}px`
    el.style.height = `${height}px`
    el.style.top = `${top}px`
    el.style.left = `${left}px`
  }

  // 使用react-transition-group/Transition组件提供的钩子函数来做运动
  // 在'entering'状态之前应用回调
  enter = (el: HTMLImageElement) => {
    // 触发回流 详情见issue: https://github.com/reactjs/react-transition-group/issues/159
    /* tslint:disable no-unused-expression*/
    el && el.scrollTop // 强制触发浏览器回流
    /* tslint:enable no-unused-expression*/
    const { width, height, top, left } = this.state.smallImgRect
    el.style.width = `${width}px`
    el.style.height = `${height}px`
    el.style.top = `${top}px`
    el.style.left = `${left}px`
  }
  // 在'entering'状态之后应用回调
  entering = (el: HTMLImageElement) => {
    this.setEnteringStyle(el)
  }
  // 在'entered'状态之后应用回调
  entered = (el: HTMLImageElement) => {
    console.log('entered', el.getBoundingClientRect())
  }
  // 在'exiting'状态之前应用回调
  exit = (el: HTMLImageElement) => {
    /* tslint:disable no-unused-expression*/
    el && el.scrollTop // 强制触发浏览器回流
    /* tslint:enable no-unused-expression*/
    const { width, height, top, left } = el.getBoundingClientRect()
    el.src = this.state.bigImageSrc
    el.style.width = `${width}px`
    el.style.height = `${height}px`
    el.style.top = `${top}px`
    el.style.left = `${left}px`
  }
  // 在'exiting'状态之后应用回调
  exiting = (el: HTMLImageElement) => {
    const { width, height, top, left } = this.state.smallImgRect
    el.style.width = `${width}px`
    el.style.height = `${height}px`
    el.style.top = `${top}px`
    el.style.left = `${left}px`
  }

  render() {
    const {
      content,
      screenshot,
      author,
      create_time,
      title,
      id,
      description
    } = this.injected.articleDetail
    const { comments, count } = this.state
    let html = ''
    if (content) {
      html = content
    }
    if (!author && this.injected.isLoading) {
      return <SkeletonLoading />
    }
    return (
      <React.Fragment>
        <div className={styles.articleContainer}>
          <Helmet>
            <title>{title} - 辞修</title>
            <meta name="description" content={description} />
          </Helmet>
          <article className={styles.article}>
            <div className={styles.articleAuthorInfo}>
              <Avatar
                size="large"
                style={{
                  color: '#fff',
                  backgroundColor: '#1890ff',
                  flex: '0 0 40px'
                }}
              >
                {author.substring(0, 1)}
              </Avatar>
              <div className={styles.articleAuthorInfoBox}>
                <span className={styles.articleAuthor}>{author}</span>
                <div className={styles.articleCreateTime}>
                  <time>{dateFormat(create_time, 'yyyy-mm-dd')}</time>
                </div>
              </div>
            </div>
            {screenshot && (
              <div
                className={styles.articleScreenshotWrapper}
                style={{
                  backgroundImage: `url(${screenshot})`,
                  backgroundSize: 'cover'
                }}
              />
            )}
            <h1 className={styles.articleTitle}>{title}</h1>
            <div
              className={styles.articleContent}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </article>
        </div>
        {this.state.showComments && (
          <div className={styles.commentsContainer}>
            <div className={styles.commentsBar}>
              <span>{count} 回复</span>
              <span>{comments[comments.length - 1].updateAt}</span>
            </div>
            <CommentsList
              comments={comments}
              articleId={id}
              userInfo={this.injected.userInfo}
              supportComment={this.supportComment}
            />
          </div>
        )}
        <div className={styles.commentsContainer}>
          <div className={styles.commentsBar}>添加评论</div>
          <div className={styles.commentsForm}>
            <MdEditor
              id="markdown-editor-comment"
              value={this.state.comment}
              onChange={this.changeValue}
              options={{
                autoDownloadFontAwesome: false,
                autofocus: false,
                spellChecker: false,
                placeholder: '这里进行markdown语法格式的书写',
                status: false,
                showIcons: ['code', 'table']
              }}
            />
            <div style={{ marginTop: '10px' }}>
              <Button type="primary" onClick={this.submitComment}>
                评论
              </Button>
            </div>
          </div>
        </div>
        <div className="image-viewer-box">
          <CSSTransition
            in={this.state.showBigImage}
            classNames={{
              enter: styles.fadeEnter,
              enterActive: styles.fadeEnterActive,
              exit: styles.fadeExit,
              exitActive: styles.fadeExitActive
            }}
            timeout={200}
            unmountOnExit
          >
            {(state: string) => (
              <div className={styles.imageViewer}>
                <div className={styles.imageBox}>
                  <Transition
                    in={state === 'entering' || state === 'entered'}
                    timeout={200}
                    // unmountOnExit
                    onEnter={this.enter}
                    onEntering={this.entering}
                    onEntered={this.entered}
                    onExit={this.exit}
                    onExiting={this.exiting}
                  >
                    <img
                      className={styles.image}
                      src={this.state.bigImageSrc}
                      // ref={this.bigImageRef}
                    />
                  </Transition>
                </div>
              </div>
            )}
          </CSSTransition>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({
  articleDetail,
  isLoading,
  userId,
  userInfo
}: IStoreState) => ({
  articleDetail,
  isLoading,
  userId,
  userInfo
})

const mergeProps = (
  stateProps: object,
  dispatchProps: object,
  ownProps: object
) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, {}, mergeProps)(Detail)
