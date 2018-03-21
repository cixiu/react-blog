import * as React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { Avatar } from 'antd'
import * as dateFormat from 'dateformat'
// import * as marked from 'marked'
import { SkeletonLoading } from '../../components/Loading/Loading'
import { IStoreState } from '../../store/types'

import * as styles from '../../styles/Detail/Detail.scss'

interface IProps {}
interface IReduxInjectedProps extends IProps {
  articleDetail: IStoreState['articleDetail']
  isLoading: boolean
}
class Detail extends React.Component {
  get injected() {
    return this.props as IReduxInjectedProps
  }

  render() {
    const {
      content,
      screenshot,
      author,
      create_time,
      title
    } = this.injected.articleDetail
    let html = ''
    if (content) {
      html = content
    }
    if (!author && this.injected.isLoading) {
      return <SkeletonLoading />
    }
    return (
      <div className={styles.articleContainer}>
        <Helmet>
          <title>{title}</title>
        </Helmet>
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
      </div>
    )
  }
}

const mapStateToProps = ({ articleDetail, isLoading }: IStoreState) => ({
  articleDetail,
  isLoading
})

const mergeProps = (
  stateProps: object,
  dispatchProps: object,
  ownProps: object
) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, {}, mergeProps)(Detail)
