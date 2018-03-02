import * as React from 'react'

export interface JssProviderProps {
  registry?: any
  generateClassName: any
}

declare const JssProvider: React.ComponentType<JssProviderProps>

export default JssProvider
