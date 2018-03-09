import * as React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

import { addCount } from '../../store/actions'
import Text from '../../components/Text/Text'
import { IStoreState } from '../../store/types'

import * as style from '../../styles/Home/Home.scss'

interface IProps extends IReduxInjectProps {}
interface IReduxInjectProps {
  count: number
  addCount: (num?: number) => void
}

class Home extends React.Component<IProps, {}> {
  componentDidMount() {}

  render() {
    return (
      <div className={style.bg}>
        <Helmet>
          <title>这是首页</title>
        </Helmet>
        Home!!!!
        <Text />
        <button onClick={() => this.props.addCount()}>+</button>
        <span>{this.props.count}</span>
      </div>
    )
  }
}

// Home.propTypes = {}

const mapStateToProps = ({ count }: IStoreState) => {
  return { count }
}

const mapDispatchToProps = { addCount }

const mergeProps = (stateProps: object, dispatchProps: object, ownProps: object) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Home)
