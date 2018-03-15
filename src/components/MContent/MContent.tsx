import * as React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'redux-first-router-link'
// import { Layout } from 'antd'
import Router from '../Router/Router'
import Aside from '../Aside/Aside'
import * as styles from './index.scss'
import { changeIsLoading } from '../../store/actions'

// const { Content } = Layout
interface IProps {}
interface IReduxInjectedProps extends IProps {
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
      { tag: 'node', text: 'Node' }
    ]
  }

  get injected() {
    return this.props as IReduxInjectedProps
  }

  render() {
    return (
      <div className={styles.mainContentContainer}>
        <div className={styles.mainContent}>
          <nav className={styles.viewNav}>
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
          <main className={styles.main}>
            <Router />
          </main>
          <Aside />
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = { changeIsLoading }
const mergeProps = (
  stateProps: object,
  dispatchProps: object,
  ownProps: object
) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(null, mapDispatchToProps, mergeProps)(MContent)
