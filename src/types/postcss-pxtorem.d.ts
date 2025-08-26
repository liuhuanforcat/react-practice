declare module 'postcss-pxtorem' {
  interface PxtoremOptions {
    rootValue?: number;
    propList?: string[];
    selectorBlackList?: string[];
    minPixelValue?: number;
    mediaQuery?: boolean;
    exclude?: RegExp;
  }
  
  function pxtorem(options?: PxtoremOptions): any;
  export = pxtorem;
}
