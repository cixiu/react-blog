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
  supportComment(comments: any[], needChangeCount?: boolean): void
}
interface IState {
  subCommentSwitches: boolean[]
  subMdeValues: any[]
  comment: string
  currentSubIndex: number
  currentCommentIndex: number
}

class CommentsList extends React.Component<IProps, IState> {
  commentArrowGroup: any[] = [] as HTMLDivElement[]
  titleGroup: any[] = [] as HTMLSpanElement[]
  state: IState = {
    subCommentSwitches: [], // 用于控制子评论的显示开关集合
    subMdeValues: [], // 用于控制子评论的编辑器的value值的集合
    comment: '',
    currentCommentIndex: -1,
    currentSubIndex: -1
  }
  componentDidMount() {
    this.initialState(this.props.comments)
  }

  componentWillReceiveProps(nextProps: IProps) {
    // 如果发布评论后要更新props上的comments列表
    if (this.props.comments.length !== nextProps.comments.length) {
      this.setState(prevState => {
        prevState.subCommentSwitches.push(false)
        prevState.subMdeValues.push({
          isReply: false,
          index: -1,
          comment: ''
        })
        return {
          subCommentSwitches: prevState.subCommentSwitches,
          subMdeValues: prevState.subMdeValues
        }
      })
    }
  }
  // 初始化需要控制的子评论的显示开关集合和子评论的编辑器的value值的集合
  initialState = (comments: any) => {
    const subCommentSwitches: any[] = []
    const subMdeValues: any[] = []
    comments.forEach(() => {
      subCommentSwitches.push(false)
      // 初始化simplemde的value值的集合
      subMdeValues.push({
        isReply: false,
        index: -1,
        comment: ''
      })
    })
    this.setState({ subCommentSwitches, subMdeValues })
  }
  // 评论点赞
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
      const comments = this.props.comments
      for (let comment of comments) {
        if (comment.id === item.id) {
          comment = item
        }
      }
      this.props.supportComment(comments)
      message.success(res.message)
    } else {
      message.error(res.message)
    }
  }
  // 子评论的显示与隐藏操作
  showSubComments = (comment: any, index: number) => {
    if (this.commentArrowGroup[index].style.display === 'none') {
      this.titleGroup[index].innerHTML = '收起评论'
      this.commentArrowGroup[index].style.display = 'block'
    } else {
      const innerHtml =
        comment.subCount === 0 ? '评论' : `${comment.subCount}条评论`
      this.titleGroup[index].innerHTML = innerHtml
      this.commentArrowGroup[index].style.display = 'none'
      // 隐藏子评论区后重置对应的subMdeValues的数据
      this.setState(prevState => {
        prevState.subMdeValues[index].isReply = false
        prevState.subMdeValues[index].index = -1
        prevState.subMdeValues[index].comment = ``
        return {
          subMdeValues: prevState.subMdeValues
        }
      })
    }
    this.setState(prevState => {
      prevState.subCommentSwitches[index] = !prevState.subCommentSwitches[index]
      return {
        subCommentSwitches: prevState.subCommentSwitches
      }
    })
  }
  // 编辑器改变返回的value值赋给对应的value集合
  changeValue = (simplemde: SimpleMDE, index: number) => {
    this.setState(prevState => {
      prevState.subMdeValues[index].comment = simplemde.value()
      return {
        subMdeValues: prevState.subMdeValues
      }
    })
    // this.setState({ comment: simplemde.value() })
  }
  // 子评论的提交 需要区别是评论还是回复评论
  submitSubComment = async (comment: any, index: number) => {
    if (!this.state.subMdeValues[index].comment) {
      message.info('请先写点什么再进行评论')
      return
    }
    const { articleId, userInfo } = this.props
    const commentId = comment.id
    const userId = userInfo.id
    // 如果是回复评论则取子评论的用户id 否则要取一级评论的id
    const respUserId = this.state.subMdeValues[index].isReply
      ? comment.subComments[this.state.subMdeValues[index].index].userId
      : comment.userId
    const content = marked(this.state.subMdeValues[index].comment)
    const res = await replyComment({
      articleId,
      commentId,
      userId,
      respUserId,
      content,
      // 是否是对评论的回复 默认是false
      isReply: this.state.subMdeValues[index].isReply
    })
    console.log(res)
    if (res.code === 0) {
      this.setState(prevState => {
        prevState.subMdeValues[index].isReply = false
        prevState.subMdeValues[index].index = -1
        prevState.subMdeValues[index].comment = ``
        return {
          subMdeValues: prevState.subMdeValues
        }
      })
      // 将评论后的数据回传给父组件 更新视图
      const comments = this.props.comments
      for (const item of comments) {
        if (item.id === comment.id) {
          item.subComments = res.data
          item.subCount++
        }
      }
      this.props.supportComment(comments, true)
      message.success('评论成功')
    } else {
      message.error('评论失败')
    }
  }
  // 在对应的子评论上mouseover时 显示回复btn
  showReplyBtn = (comment: any, subIndex: number, index: number) => {
    this.setState({ currentSubIndex: subIndex, currentCommentIndex: index })
  }
  // 在对应的子评论上mouseout时 隐藏回复btn
  hideReplyBtn = () => {
    this.setState({ currentSubIndex: -1, currentCommentIndex: -1 })
  }
  // 点击子评论下的回复btn时 将请求需要的数据传入对应subMdeValues集合中
  handleIsReplyBtn = (subComment: any, index: number, subIndex: number) => {
    this.setState(prevState => {
      prevState.subMdeValues[index].isReply = true
      prevState.subMdeValues[index].index = subIndex
      prevState.subMdeValues[index].comment = `回复 ${
        subComment.userInfo.username
      } : `
      return {
        subMdeValues: prevState.subMdeValues
      }
    })
  }

  render() {
    const { comments } = this.props
    return (
      <div className="comments-list">
        {comments.map((item, index) => (
          <div key={item.id} className={styles.commentsItem}>
            <Avatar size="large" className={styles.itemAvatar}>
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
                    {item.subCount === 0
                      ? '评论'
                      : this.state.subCommentSwitches[index]
                        ? '收起评论'
                        : `${item.subCount}条评论`}
                  </span>
                  <div
                    className={styles.subCommentArrow}
                    style={{ display: 'none' }}
                    ref={el => (this.commentArrowGroup[index] = el)}
                  />
                </span>
              </div>
              {/* 子评论列表 */}
              {this.state.subCommentSwitches[index] && (
                <div className={styles.subCommentBox}>
                  <div className={styles.subCommentBoxInner}>
                    {item.subCount === 0 ? (
                      <div className={styles.emptyComment}>暂时还没有评论</div>
                    ) : (
                      <div>
                        <ul className={styles.subCommentList}>
                          {item.subComments.map(
                            (subComment: any, subIndex: number) => (
                              <li key={subComment.id} className={styles.item}>
                                <div
                                  className={styles.subCommentItem}
                                  onMouseOver={() =>
                                    this.showReplyBtn(
                                      subComment,
                                      subIndex,
                                      index
                                    )
                                  }
                                  onMouseOut={this.hideReplyBtn}
                                >
                                  <Avatar
                                    style={{
                                      position: 'absolute',
                                      color: '#fff',
                                      backgroundColor: '#1890ff'
                                    }}
                                  >
                                    {subComment.userInfo.username.substring(
                                      0,
                                      1
                                    )}
                                  </Avatar>
                                  <div style={{marginLeft: '42px'}}>
                                    <div className={styles.commentTitle}>
                                      <span
                                        className={styles.subCommentUsername}
                                      >
                                        {subComment.userInfo.username}
                                      </span>
                                    </div>
                                    <div className={styles.commentContent}>
                                      {/* {subComment.respComment && (
                                        <span>
                                          回复{' '}
                                          <span>
                                            {subComment.respUserInfo.username}
                                          </span>：
                                        </span>
                                      )} */}
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: subComment.content
                                        }}
                                      />
                                    </div>
                                    <div
                                      className={`${styles.commentOperation} ${
                                        styles.subCommentOperation
                                      }`}
                                    >
                                      <time>{subComment.updateAt}</time>
                                      <a
                                        style={{
                                          display:
                                            this.state.currentSubIndex ===
                                              subIndex &&
                                            this.state.currentCommentIndex ===
                                              index
                                              ? 'block'
                                              : 'none'
                                        }}
                                        onClick={() =>
                                          this.handleIsReplyBtn(
                                            subComment,
                                            index,
                                            subIndex
                                          )
                                        }
                                      >
                                        回复
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                    <div className={styles.replyForm}>
                      {/* <textarea
                        rows={1}
                        placeholder={
                          this.state.subMdeValues[index].placeholder
                        }
                        style={{
                          overflow: 'hidden',
                          wordWrap: 'break-word',
                          height: '35px'
                        }}
                      /> */}
                      <MdEditor
                        id={`markdown-editor-${item.id}`}
                        value={
                          this.state.subMdeValues[index]
                            ? this.state.subMdeValues[index].comment
                            : ''
                        }
                        onChange={simplemde =>
                          this.changeValue(simplemde, index)
                        }
                        options={{
                          autoDownloadFontAwesome: false,
                          autofocus: false,
                          spellChecker: false,
                          placeholder: '请输入评论',
                          status: false,
                          showIcons: ['code', 'table']
                        }}
                      />
                      <div style={{ marginTop: '10px' }}>
                        <Button
                          type="primary"
                          onClick={() => this.submitSubComment(item, index)}
                        >
                          评论
                        </Button>
                      </div>
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
