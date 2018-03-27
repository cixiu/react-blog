import * as React from 'react'
import { Avatar, Icon } from 'antd'
import * as dateFormat from 'dateformat'

import * as styles from './index.scss'

interface IProps {
  comments: any[]
}

class CommentsList extends React.Component<IProps, {}> {
  componentDidMount() {}

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
                <button className={styles.commentLikeBtn}>
                  <Icon type="caret-up" style={{ marginRight: '5px', fontSize: '12px' }}/>
                  <span>{item.likesCount}</span>
                </button>
                <span className={styles.subCommentBtn}>
                  <Icon type="message" style={{ marginRight: '5px' }} />
                  <span>评论</span>
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
