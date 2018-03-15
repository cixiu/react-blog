// import { redirect } from 'redux-first-router'
import * as queryString from 'query-string'

const options = {
  // onBeforeChange: async (dispatch, getState, { action }) => {
  //   // const { page } = getState()
  //   if (action.type === 'MUSIC') {
  //     console.log(123)
  //     dispatch(redirect({ type: 'MOVIE' }))
  //   }
  // }
  querySerializer: queryString,
  scrollTop: true
}

export default options
