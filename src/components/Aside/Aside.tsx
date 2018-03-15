import * as React from 'react'
import Login from '../Login/Login'
import * as styles from './index.scss'

class Aside extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <aside className={styles.aside}>
        <Login />
      </aside>
    )
  }
}

export default Aside
