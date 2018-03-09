import * as React from 'react'
// import { connect } from 'react-redux'
import Helmet from 'react-helmet'

import * as s from '../../styles/Category/Category.scss'

class Category extends React.Component {
  componentDidMount() {
    console.log(this.props)
  }

  render() {
    return (
      <div className={s.bg}>
        <Helmet>
          <title>CATEGORY</title>
        </Helmet>
        <span>dafjdhg</span>
      </div>
    )
  }
}

// Category.propTypes = {}

// const mapStateToProps = ({ location }) => {
//   return {
//     category: location.payload.category
//   }
// }

export default Category
