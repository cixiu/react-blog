interface ICount {
  type: string
  count: number
}

const count = (state = 0, action: ICount) => {
  switch (action.type) {
    case 'COUNT':
      return state + action.count
    default:
      return state
  }
}

export default count
