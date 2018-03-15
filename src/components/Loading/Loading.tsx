import * as React from 'react'
import ContentLoader from 'react-content-loader'
import { Icon } from 'antd'
import * as styles from './index.scss'

// 骨架屏Loading组件
export const SkeletonLoading = () => (
  <div className={styles.skeletonLoading}>
    <ContentLoader
      width={820}
      height={170}
      speed={2}
      primaryColor={'#f3f3f3'}
      secondaryColor={'#ecebeb'}
    >
      <rect x="20" y="20" rx="0" ry="0" width="200" height="130" />
      <rect x="230" y="20" rx="0" ry="0" width="440" height="25" />
      <rect x="230" y="72.5" rx="0" ry="0" width="480" height="25" />
      <rect x="230" y="125" rx="0" ry="0" width="520" height="25" />
    </ContentLoader>
  </div>
)

class Loading extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div className={styles.loading}>
        <Icon
          type="loading"
          style={{ fontSize: 100, color: '#1890ff' }}
        />
      </div>
    )
  }
}

export default Loading
