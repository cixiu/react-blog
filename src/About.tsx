import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import Button from 'material-ui/Button'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import * as actions from './store/actions'
import { IStoreState } from './store/types'
// import * as styles from './index.scss'
import * as abouts from './about.scss'

interface IAboutProps {
  count: number
  OnIncrement: () => void
}
// @withStyles(styles)
class About extends React.Component<IAboutProps, {}> {
  componentDidMount() {
    console.log(this.props.count)
  }
  asyncBootstrap() {
    const p1 = new Promise((resolve) => {
      setTimeout(resolve, 0)
    })
    return Promise.all([p1]).then((res) => {
      this.props.OnIncrement()
      return true
    })
  }

  render() {
    return (
      <div>
        <span className={abouts.about}>大幅扩大</span>
        <Button variant="raised" color="primary" onClick={this.props.OnIncrement}>add</Button>
        关于我们{this.props.count}
      </div>
    )
  }
}
const mapStateToProps = ({count}: IStoreState) => {
  return {
    count
  }
}

const mapDispatchToProps = (dispatch: Dispatch<actions.IAddCount>) => {
  return {
    OnIncrement: () => dispatch(actions.addCount(1)),
  }
}

const mergeProps = (stateProps: object, dispatchProps: object, ownProps: object) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(withStyles(abouts)(About))
