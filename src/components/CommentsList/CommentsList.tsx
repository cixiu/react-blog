import * as React from 'react'
import { Avatar, Icon, message, Button } from 'antd'
import * as dateFormat from 'dateformat'
import * as classNames from 'classnames/bind'
import MdEditor from '../MdEditor/MdEditor'
import marked from '../../common/ts/marked'
import { likeComment, replyComment } from '../../api/comments'
import { IUserInfo } from '../../store/types'

import * as styles from './index.scss'

const cx = classNames.bind(styles)
interface IProps {
  comments: any[]
  articleId: number
  userInfo: IUserInfo
  supportComment(item: any): void
}
interface IState {
  subCommentSwitches: boolean[]
  comment: string
  currentSubIndex: number
}

class CommentsList extends React.Component<IProps, IState> {
  commentArrowGroup: any[] = [] as HTMLDivElement[]
  titleGroup: any[] = [] as HTMLSpanElement[]
  state = {
    subCommentSwitches: [], // 用于控制子评论的显示开关集合
    comment: '',
    currentSubIndex: -1
  }
  componentDidMount() {
    this.setState({
      subCommentSwitches: new Array(this.props.comments.length).fill(false)
    })
  }

  submitLike = async (item: any) => {
    const { articleId, userInfo } = this.props
    const data = {
      commentId: item.id,
      userId: userInfo.id
    }
    const res = await likeComment(articleId, data)
    if (res.code === 0) {
      // 如果是点赞
      if (res.isLiked) {
        item.likedUser.push(userInfo)
        item.isLiked = res.isLiked
        item.likesCount = res.likesCount
      } else {
        // 如果是取消点赞
        item.likedUser = item.likedUser.filter(
          (user: any) => user.id !== userInfo.id
        )
        item.isLiked = res.isLiked
        item.likesCount = res.likesCount
      }
      // 将点赞后的数据回传给父组件 更新视图
      this.props.supportComment(item)
      message.success(res.message)
    } else {
      message.error(res.message)
    }
  }

  showSubComments = (comment: any, index: number) => {
    if (this.commentArrowGroup[index].style.display === 'none') {
      this.titleGroup[index].innerHTML = '收起评论'
      this.commentArrowGroup[index].style.display = 'block'
    } else {
      const innerHtml =
        comment.subCount === 0 ? '评论' : `${comment.subCount}条评论`
      this.titleGroup[index].innerHTML = innerHtml
      this.commentArrowGroup[index].style.display = 'none'
    }
    this.setState(prevState => {
      prevState.subCommentSwitches[index] = !prevState.subCommentSwitches[index]
      return {
        subCommentSwitches: prevState.subCommentSwitches
      }
    })
  }

  changeValue = (simplemde: SimpleMDE) => {
    this.setState({ comment: simplemde.value() })
  }

  submitSubComment = async (comment: any) => {
    if (!this.state.comment) {
      message.info('请先写点什么再进行评论')
      return
    }
    const { articleId, userInfo } = this.props
    const commentId = comment.id
    const userId = userInfo.id
    const respUserId = comment.userId
    const content = marked(this.state.comment)
    console.log(content)
    // const articleId = this.injected.articleDetail.id
    // const userId = this.injected.userId
    // const content = marked(this.state.comment)
    const res = await replyComment({
      articleId,
      commentId,
      userId,
      respUserId,
      content
    })
    console.log(res)
    // if (res.code === 0) {
    //   this.setState(prevState => {
    //     return {
    //       comments: prevState.comments.concat(res.data),
    //       comment: '',
    //       showComments: true
    //     }
    //   })
    //   message.success('评论成功')
    // } else {
    //   message.error('评论失败')
    // }
  }

  showReplyBtn = (comment: any, index: number) => {
    this.setState({ currentSubIndex: index })
  }

  render() {
    const { comments } = this.props
    return (
      <div className="comments-list">
        {comments.map((item, index) => (
          <div key={item.id} className={styles.commentsItem}>
            <Avatar
              size="large"
              style={{
                color: '#fff',
                backgroundColor: '#1890ff',
                flex: '0 0 40px'
              }}
            >
              {item.userInfo.username.substring(0, 1)}
            </Avatar>
            <div className={styles.itemComment}>
              <div className={styles.commentTitle}>
                <span className={styles.commentUsername}>
                  {item.userInfo.username}
                </span>
                <time>{dateFormat(item.createAt, 'yyyy-mm-dd')}</time>
                <span className={styles.commentFloor}>{item.id}楼</span>
              </div>
              <div
                className={styles.commentContent}
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
              <div className={styles.commentOperation}>
                <button
                  className={cx({
                    commentLikeBtn: true,
                    isLiked: item.isLiked
                  })}
                  onClick={() => this.submitLike(item)}
                >
                  <Icon
                    type="caret-up"
                    style={{ marginRight: '5px', fontSize: '12px' }}
                  />
                  <span>{item.likesCount}</span>
                </button>
                <span
                  className={styles.subCommentBtn}
                  onClick={() => this.showSubComments(item, index)}
                >
                  <Icon type="message" style={{ marginRight: '5px' }} />
                  <span ref={el => (this.titleGroup[index] = el)}>
                    {item.subCount === 0 ? '评论' : `${item.subCount}条评论`}
                  </span>
                  <div
                    className={styles.subCommentArrow}
                    style={{ display: 'none' }}
                    ref={el => (this.commentArrowGroup[index] = el)}
                  />
                </span>
              </div>
              {this.state.subCommentSwitches[index] && (
                <div className={styles.subCommentBox}>
                  <div className={styles.subCommentBoxInner}>
                    {item.subCount === 0 ? (
                      <div className={styles.emptyComment}>暂时还没有评论</div>
                    ) : (
                      <div>
                        <ul className={styles.subCommentList}>
                          {item.subComments.map((subComment: any, subIndex: number) => (
                            <li key={subComment.id}>
                              <div
                                className={styles.subCommentItem}
                                onMouseOver={() =>
                                  this.showReplyBtn(subComment, subIndex)
                                }
                              >
                                <Avatar
                                  style={{
                                    color: '#fff',
                                    backgroundColor: '#1890ff'
                                  }}
                                >
                                  {subComment.userInfo.username.substring(0, 1)}
                                </Avatar>
                                <div className={styles.itemComment}>
                                  <div className={styles.commentTitle}>
                                    <span className={styles.subCommentUsername}>
                                      {subComment.userInfo.username}
                                    </span>
                                  </div>
                                  <div
                                    className={styles.commentContent}
                                    dangerouslySetInnerHTML={{
                                      __html: subComment.content
                                    }}
                                  />
                                  <div
                                    className={`${styles.commentOperation} ${
                                      styles.subCommentOperation
                                    }`}
                                  >
                                    <time>{subComment.updateAt}</time>
                                    {this.state.currentSubIndex === subIndex && <a>回复</a>}
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className={styles.replyForm}>
                      <MdEditor
                        id={`markdown-editor-${item.id}`}
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
                        onClick={() => this.submitSubComment(item)}
                      >
                        评论
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }
}

export default CommentsList
