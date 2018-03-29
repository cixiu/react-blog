import * as React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { Avatar, Button, message } from 'antd'
import * as dateFormat from 'dateformat'
import marked from '../../common/ts/marked'
import CommentsList from '../../components/CommentsList/CommentsList'
import MdEditor from '../../components/MdEditor/MdEditor'
import { SkeletonLoading } from '../../components/Loading/Loading'
import { IStoreState } from '../../store/types'
import { createComment, getArticleComments } from '../../api/comments'

import * as styles from '../../styles/Detail/Detail.scss'

// const { TextArea } = Input
interface IState {
  showComments: boolean
  comments: any[]
  comment: string
  count: number
}

interface IProps {}
interface IReduxInjectedProps extends IProps {
  articleDetail: IStoreState['articleDetail']
  isLoading: boolean
  userId: number
  userInfo: IStoreState['userInfo']
}
class Detail extends React.Component<IProps, IState> {
  state: IState = {
    showComments: false,
    comments: [],
    comment: '',
    count: 0
  }
  get injected() {
    return this.props as IReduxInjectedProps
  }

  async componentDidMount() {
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

  changeValue = (simplemde: SimpleMDE) => {
    this.setState({ comment: simplemde.value() })
  }

  supportComment = (item: any) => {
    const comments = this.state.comments
    for (let comment of comments) {
      if (comment.id === item.id) {
        comment = item
      }
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

  render() {
    const {
      content,
      screenshot,
      author,
      create_time,
      title,
      id
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
            <title>{title}</title>
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
            <Button
              type="primary"
              style={{ marginTop: '10px' }}
              onClick={this.submitComment}
            >
              评论
            </Button>
          </div>
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
