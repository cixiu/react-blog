import * as React from 'react'
import { connect } from 'react-redux'
import * as style from './index.scss'
import { addCount } from '../../store/actions'
import { IStoreState } from '../../store/types'

interface IProps {}
interface IReduxInjectProps extends IProps {
  count: number
  addCount: (num?: number) => void
}

class Text extends React.Component<IProps, {}> {
  componentDidMount() {}

  get injected() {
    return this.props as IReduxInjectProps
  }

  render() {
    return (
      <div className={style.text}>
        sdjfkjdalfj!! <span>{this.injected.count}</span>
      </div>
    )
  }
}

const mapStateToProps = ({ count }: IStoreState) => {
  return { count }
}

const mapDispatchToProps = { addCount }

const mergeProps = (
  stateProps: object,
  dispatchProps: object,
  ownProps: object
) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Text)
