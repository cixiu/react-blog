import * as React from 'react'

export interface IWithStyles {
  (styles: object): (component: any) => any
}

export declare const withStyles: IWithStyles

export default withStyles
