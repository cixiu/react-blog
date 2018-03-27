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
  totalCount: number
  comment: string
}

interface IProps {}
interface IReduxInjectedProps extends IProps {
  articleDetail: IStoreState['articleDetail']
  isLoading: boolean
  userId: number
}
class Detail extends React.Component<IProps, IState> {
  state = {
    showComments: false,
    comments: [] as any[],
    totalCount: 0,
    comment: ''
  }
  async componentDidMount() {
    const res = await getArticleComments(this.injected.articleDetail.id)
    if (res.code === 0 && res.data.count) {
      this.setState({
        comments: res.data.comments,
        totalCount: res.data.count,
        showComments: true
      })
    }
  }

  get injected() {
    return this.props as IReduxInjectedProps
  }

  changeValue = (simplemde: SimpleMDE) => {
    this.setState({ comment: simplemde.value() })
  }

  submitComment = async () => {
    if (!this.state.comment) {
      message.info('请先写点什么再进行评论')
      return
    }
    const articleId = this.injected.articleDetail.id
    const userId = this.injected.userId
    const content = marked(this.state.comment)
    const res = await createComment({ articleId, userId, content })
    if (res.code === 0) {
      this.setState(prevState => {
        return {
          comments: prevState.comments.concat(res.data),
          comment: ''
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
      title
    } = this.injected.articleDetail
    const { totalCount, comments } = this.state
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
              <span>{totalCount}回复</span>
              <span>{comments[totalCount - 1].updateAt}</span>
            </div>
            <CommentsList comments={comments}/>
          </div>
        )}
        <div className={styles.commentsContainer}>
          <div className={styles.commentsBar}>添加评论</div>
          <div className={styles.commentsForm}>
            <MdEditor
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
  userId
}: IStoreState) => ({
  articleDetail,
  isLoading,
  userId
})

const mergeProps = (
  stateProps: object,
  dispatchProps: object,
  ownProps: object
) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, {}, mergeProps)(Detail)
