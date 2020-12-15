// ! TEMPORÁRIO
// TODO: Arranjar uma forma de não precisar desse disable
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { HelpData } from './types'

export function Command (...commandNames: string[]) {
  return (target: any): void => {
    Reflect.defineMetadata('command:names', commandNames, target)
  }
}

export function HelpInfo (data: HelpData) {
  return (target: any): void => {
    Reflect.defineMetadata('command:help', data, target)
  }
}
