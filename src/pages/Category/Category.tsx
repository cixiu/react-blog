import * as React from 'react'
import { LocationState, Location } from 'redux-first-router'
import Link, { NavLink, Match } from 'redux-first-router-link'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { Icon } from 'antd'
import * as dateFormat from 'dateformat'
import * as InfiniteScroll from 'react-infinite-scroller'

import { SkeletonLoading } from '../../components/Loading/Loading'
import * as styles from '../../styles/Category/Category.scss'
import { IStoreState } from '../../store/types'
import { getArticleList } from '../../api/article'
import { addArticleList, changeHasMore } from '../../store/actions'

interface ILocation extends LocationState {
  pathname: string
  payload: {
    category?: string
  }
  query?: {
    sort?: string
  }
}
interface IProps {}
interface IReduxInjectedProps extends IProps {
  location: ILocation
  articleList: IStoreState['articleList']
  hasMore: boolean
  isLoading: boolean
  addArticleList: (list: any[]) => void
  changeHasMore: (flag: boolean) => void
}
interface IState {
  navList: Array<{
    sort: string
    text: string
  }>
  loading: boolean
  limit: number
  current: number
  flag: boolean
  pathname: string
  isLoading: boolean
}

class Category extends React.Component<IProps, IState> {
  state = {
    navList: [
      { sort: 'recently', text: '最近更新' },
      { sort: 'read', text: '阅读最多' }
    ],
    limit: 10,
    loading: false, // 用于控制加载更多的Loading
    current: 0, // 用于控制当前要显示的页数
    flag: false, // 用于控制切换标签的再次数据请求，在thunk中已经请求了 在loadMore中不需要初次在请求
    pathname: this.injected.location.pathname,
    isLoading: this.injected.isLoading
  }

  get injected() {
    return this.props as IReduxInjectedProps
  }

  static getDerivedStateFromProps(
    nextProps: IReduxInjectedProps,
    prevState: IState
  ) {
    if (
      nextProps.location.pathname !== prevState.pathname ||
      nextProps.isLoading !== prevState.isLoading
    ) {
      return {
        pathname: nextProps.location.pathname,
        isLoading: nextProps.isLoading,
        current: 0,
        flag: true
      }
    }
    return null
  }

  // FIXME:迁移到getDerivedStateFromProps生命周期中
  // componentWillReceiveProps(nextProps: IReduxInjectedProps) {
  //   if (
  //     this.injected.location.pathname !== nextProps.location.pathname ||
  //     this.injected.isLoading !== nextProps.isLoading
  //   ) {
  //     this.setState({
  //       current: 0,
  //       flag: true
  //     })
  //   }
  // }

  isActive = (match: Match<{}>, location: Location, sort = 'recently') => {
    const query: { sort: string } = location.query as any
    if (!query) {
      return sort === 'recently'
    }
    return match.path === location.pathname && query.sort === sort
  }

  navToSort = () => {
    this.setState({
      current: 0
    })
  }

  loadMore = async (page: number) => {
    // 阻止在切换导航标签时loadMore
    if (this.state.flag) {
      console.log('flag')
      this.setState({
        flag: false
      })
      return
    }
    if (this.injected.isLoading) {
      console.log('正在初始化数据中...')
      return
    }
    console.log('loadMore', page)
    this.injected.changeHasMore(false)
    this.setState(preState => ({
      loading: true,
      current: preState.current + 1
    }))
    console.log(this.state.current)
    const { payload, query } = this.injected.location
    const { limit, current } = this.state
    const res = await getArticleList({
      offset: current * limit,
      limit,
      category: payload.category,
      sort: query && query.sort
    })
    if (res.code === 1) {
      this.injected.changeHasMore(false)
    } else {
      if (res.data.length < limit) {
        this.injected.changeHasMore(false)
      } else {
        this.injected.changeHasMore(true)
      }
      const newArticleList = this.injected.articleList.concat(res.data)
      this.injected.addArticleList(newArticleList)
    }
    this.setState({
      loading: false
    })
  }

  render() {
    // console.log(this.injected.isLoading, '---------')
    const { pathname, payload } = this.injected.location
    const { articleList } = this.injected
    return (
      <div className={styles.category}>
        <Helmet>
          <title>{payload.category} - 辞修</title>
        </Helmet>
        <header className={styles.listHeader}>
          <ul className={styles.navList}>
            {this.state.navList.map(item => (
              <NavLink
                key={item.sort}
                tagName="li"
                to={`${pathname}?sort=${item.sort}`}
                className={styles.navItem}
                activeStyle={{ color: '#1890ff' }}
                isActive={(match, location) =>
                  this.isActive(match, location, item.sort)
                }
                onClick={this.navToSort}
              >
                {item.text}
              </NavLink>
            ))}
          </ul>
        </header>
        {articleList.length > 0 && (
          <InfiniteScroll
            initialLoad={false}
            hasMore={!this.state.loading && this.injected.hasMore}
            loadMore={this.loadMore}
          >
            <ul className={styles.listContent}>
              {this.injected.isLoading && (
                <li>
                  <SkeletonLoading />
                </li>
              )}
              {!this.injected.isLoading &&
                articleList.map(article => (
                  <li className={styles.listItem} key={article.id}>
                    <Link to={`/detail/${article.id}`} target="__blank">
                      <div className={styles.articel}>
                        {article.screenshot && (
                          <div className={styles.articelScreenshotContainer}>
                            <div className={styles.articelScreenshot}>
                              <img src={article.screenshot} alt="screenshot" />
                            </div>
                          </div>
                        )}
                        <div className={styles.articleContent}>
                          <div className={styles.labelList}>
                            <time className={styles.createTime}>
                              <Icon
                                type="clock-circle-o"
                                style={{ marginRight: '4px' }}
                              />
                              {dateFormat(article.create_time, 'yyyy-mm-dd')}
                            </time>
                            <span className={styles.readComment}>
                              <span>
                                <Icon
                                  type="eye-o"
                                  style={{ marginRight: '4px' }}
                                />
                                阅读({article.views_count})
                              </span>
                              <span>
                                <Icon
                                  type="message"
                                  style={{ marginRight: '4px' }}
                                />
                                评论({article.comment_count})
                              </span>
                            </span>
                            <span className={styles.labels}>
                              {article.category.map(tag => (
                                <span key={tag.title} style={{ marginLeft: 6 }}>
                                  {tag.title}
                                </span>
                              ))}
                            </span>
                          </div>
                          <h2 className={styles.title}>{article.title}</h2>
                          <p>{article.description}</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
            </ul>
            {this.state.loading &&
              !this.injected.isLoading && <SkeletonLoading />}
          </InfiniteScroll>
        )}
        {articleList.length === 0 &&
          !this.injected.isLoading && (
            <div className={styles.noData}>这个分类暂时还没有文章</div>
          )}
      </div>
    )
  }
}

// Category.propTypes = {}

const mapStateToProps = ({
  location,
  articleList,
  hasMore,
  isLoading
}: IStoreState) => {
  return {
    location,
    articleList,
    hasMore,
    isLoading
  }
}
const mapDisPatchToProps = { addArticleList, changeHasMore }
const mergeProps = (
  stateProps: object,
  dispatchProps: object,
  ownProps: object
) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, mapDisPatchToProps, mergeProps)(
  Category
)
