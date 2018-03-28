import * as React from 'react'
import { Avatar, Icon, message } from 'antd'
import * as dateFormat from 'dateformat'
import * as classNames from 'classnames/bind'
import { likeComment } from '../../api/comments'
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
  subCommentId: number
}

class CommentsList extends React.Component<IProps, IState> {
  state = {
    subCommentId: 0
  }
  componentDidMount() {}

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

  showSubComments = (comment: any) => {
    if (this.state.subCommentId) {
      this.setState({ subCommentId: 0 })
      return
    }
    this.setState({ subCommentId: comment.id })
  }

  render() {
    const { comments } = this.props
    return (
      <div className="comments-list">
        {comments.map(item => (
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
                  onClick={() => this.showSubComments(item)}
                >
                  <Icon type="message" style={{ marginRight: '5px' }} />
                  <span>
                    {this.state.subCommentId === item.id ? '收起评论' : '评论'}
                  </span>
                  {this.state.subCommentId === item.id && (
                    <div className={styles.subCommentArrow} />
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
}

export default CommentsList
