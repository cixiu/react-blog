import * as React from 'react'
import universal from 'react-universal-component'
import importCss from 'babel-plugin-universal-import/importCss'
import { connect } from 'react-redux'
import { SkeletonLoading } from '../Loading/Loading'
import { IStoreState } from '../../store/types'

interface IWebpackRequire extends NodeRequire {
  resolveWeak(path: string): number | string
}
declare const require: IWebpackRequire

const load = (props: any) => {
  return Promise.all([
    import(/* webpackChunkName: '[request]' */ `../../pages/${props.page}/${
      props.page
    }`),
    importCss(`${props.page}-${props.page}`)
  ]).then(proms => proms[0])
}

// 路由组件如何使用了多册嵌套 chunkName需要使用-来连接
const UniversalComponent = universal(load, {
  minDelay: 500,
  alwaysDelay: true,
  loading: SkeletonLoading,
  chunkName: props => `${props.page}-${props.page}`,
  resolve: props => {
    return require.resolveWeak(`../../pages/${props.page}/${props.page}`)
  }
})

interface IProps {}
interface IReduxInjectProps extends IProps {
  page: string
}

class Router extends React.Component<IProps, {}> {
  get injected() {
    return this.props as IReduxInjectProps
  }

  render() {
    return <UniversalComponent page={this.injected.page} />
  }
}

const mapStateToProps = (state: IStoreState) => {
  return {
    page: state.page
  }
}

const mapDispatchToProps = {}

const mergeProps = (
  stateProps: object,
  dispatchProps: object,
  ownProps: object
) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Router)
