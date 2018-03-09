import * as React from 'react'
import { connect } from 'react-redux'
import universal from 'react-universal-component'
import * as path from 'path'
// import universalImport from 'babel-plugin-universal-import/universalImport'
import importCss from 'babel-plugin-universal-import/importCss'
// import { Spin, Icon } from 'antd'
import { IStoreState } from '../../store/types'

interface IWebpackRequire extends NodeRequire {
  resolveWeak(path: string): number | string
}
declare const require: IWebpackRequire

const load = (props: any) => {
  return Promise.all([
    import(/* webpackChunkName: '[request]' */ `../../pages/${props.page}/${props.page}`),
    importCss(`${props.page}-${props.page}`)
  ]).then(proms => proms[0])
}

const UniversalComponent = universal(load, {
  minDelay: 500,
  path: props => path.join(__dirname, `../../pages/${props.page}/${props.page}`),
  chunkName: props => `${props.page}-${props.page}`,
  resolve: props => {
    return require.resolveWeak(`../../pages/${props.page}/${props.page}`)
  }
})

// const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />

// const UniversalComponent = universal(({ page }: {page: string}) => import(`../../pages/${page}/${page}`), {
//   minDelay: 500,
//   loading: <Spin indicator={antIcon} />
// })

interface IProps {}
interface IReduxInjectProps extends IProps {
  page: string
}

class Switch extends React.Component<IProps, {}> {
  componentDidMount() {}

  get injected() {
    return this.props as IReduxInjectProps
  }

  render() {
    return <UniversalComponent page={this.injected.page} />
  }
}

const mapStateToProps = ({ page }: IStoreState) => {
  return {
    page
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Switch)
