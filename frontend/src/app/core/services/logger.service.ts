import {environment} from '@environment/environment';

export class LoggerService {

  constructor() {
  }

  static log(value: any, ...rest: any[]) {
    if (!environment.production) {
      console.log(value, ...rest);
    }
  }

  static error(error: any) {
    console.error(error);
  }

  static warn(value: any, ...rest: any[]) {
    if (!environment.production) {
      console.warn(value, ...rest);
    }
  }
}
