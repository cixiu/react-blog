import * as React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'redux-first-router-link'
import { BackTop } from 'antd'
import * as classNames from 'classnames/bind'
import Router from '../Router/Router'
import Aside from '../Aside/Aside'
import { changeIsLoading } from '../../store/actions'
import { IStoreState } from '../../store/types'

import * as styles from './index.scss'

const cx = classNames.bind(styles)
interface IProps {
  flag: boolean
}
interface IReduxInjectedProps extends IProps {
  page: string
  changeIsLoading: (flag: boolean) => void
}

class MContent extends React.Component<IProps, {}> {
  state = {
    tags: [
      { tag: 'all', text: '全部' },
      { tag: 'html', text: 'HTML' },
      { tag: 'css', text: 'CSS' },
      { tag: 'javascript', text: 'JavaScript' },
      { tag: 'typescript', text: 'TypeScript' },
      { tag: 'es6', text: 'ES6' },
      { tag: 'react', text: 'React' },
      { tag: 'vue', text: 'Vue' },
      { tag: 'angular', text: 'Angular' },
      { tag: 'webpack', text: 'Webpack' },
      { tag: 'node', text: 'Node' },
      { tag: 'zhuanzai', text: '转载' },
      { tag: 'others', text: '其他' },
      { tag: 'test', text: '测试' }
    ]
  }

  get injected() {
    return this.props as IReduxInjectedProps
  }

  render() {
    return (
      <div className={styles.mainContentContainer}>
        <div
          className={cx({
            mainContent: true,
            hasViewNav: this.injected.page === 'Category'
          })}
        >
          {this.injected.page === 'Category' && (
            <nav className={cx({ viewNav: true, slideTop: this.props.flag })}>
              <ul className={styles.navList}>
                {this.state.tags.map(item => (
                  <NavLink
                    tagName="li"
                    key={item.tag}
                    className={styles.navItem}
                    to={`/category/${item.tag}`}
                    activeStyle={{ color: '#1890ff' }}
                  >
                    {item.text}
                  </NavLink>
                ))}
              </ul>
            </nav>
          )}
          <main className={styles.main}>
            <Router />
          </main>
          <Aside />
          <BackTop />
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ page }: IStoreState) => ({
  page
})
const mapDispatchToProps = { changeIsLoading }
const mergeProps = (
  stateProps: object,
  dispatchProps: object,
  ownProps: object
) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  MContent
)
