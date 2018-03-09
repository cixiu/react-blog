import * as React from 'react'
import { connect } from 'react-redux'
import { goToPage } from '../../store/actions/routerActions'
import { IStoreState } from '../../store/types'

interface IProps {}
interface IReduxInjectProps extends IProps {
  page: string
  goToPage: (type: string, category?: string) => void
}

class Header extends React.Component<IProps, {}> {
  componentDidMount() {}

  get injected() {
    return this.props as IReduxInjectProps
  }

  render() {
    return (
      <div>
        <ul>
          <li>
            <button onClick={() => this.injected.goToPage('HOME')}>Home</button>
          </li>
          <li>
            <button onClick={() => this.injected.goToPage('MOVIE')}>Movie</button>
          </li>
          <li>
            <button onClick={() => this.injected.goToPage('MUSIC')}>Music</button>
          </li>
          <li>
            <button onClick={() => this.injected.goToPage('CATEGORY', 'html')}>
              Html
            </button>
          </li>
          <li>
            <button onClick={() => this.injected.goToPage('CATEGORY', 'css')}>
              Css
            </button>
          </li>
          <li>
            <button
              onClick={() => this.injected.goToPage('CATEGORY', 'javascript')}
            >
              Javascript
            </button>
          </li>
        </ul>
      </div>
    )
  }
}

const mapStateToProps = ({ page }: IStoreState) => {
  return {
    page
  }
}

const mapDispatchToProps = { goToPage }

const mergeProps = (
  stateProps: object,
  dispatchProps: object,
  ownProps: object
) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Header)
