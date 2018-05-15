import * as React from 'react'
import { Button } from 'antd'
import Helmet from 'react-helmet'
import * as styles from '../../styles/NotFound/NotFound.scss'

const bgCloud = require('../../common/images/bg-cloud.png')
const xiaoxiong = require('../../common/images/xiaoxiong.png')
const bgSea = require('../../common/images/bg-sea.png')
const bgSpray = require('../../common/images/bg-spray.png')

class NotFound extends React.Component {
  render() {
    return (
      <>
        <Helmet>
          <title>找不到页面 - 辞修</title>
          <meta name="description" content="辞修的个人博客" />
        </Helmet>
        <div className={styles.viewBg} />
        <div className={styles.notFoundView}>
          <div className={styles.bgContainer}>
            <img
              className={`${styles.img} ${styles.cloud}`}
              src={bgCloud}
              alt="404 Not Found"
            />
            <img
              className={`${styles.img} ${styles.xiaoxiong}`}
              src={xiaoxiong}
              alt="小熊"
            />
            <img
              className={`${styles.img} ${styles.sea}`}
              src={bgSea}
              alt="海"
            />
            <img
              className={`${styles.img} ${styles.spray}`}
              src={bgSpray}
              alt="浪花"
            />
          </div>
          <Button
            type="primary"
            size="large"
            href="/category/all"
            style={{ display: 'block', marginTop: 10 }}
          >
            回到首页
          </Button>
        </div>
      </>
    )
  }
}

export default NotFound
