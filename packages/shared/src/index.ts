import { makeMap } from './makeMap'

export * from './codeframe'
export * from './domAttrConfig'
export * from './domTagConfig'
export * from './escapeHtml'
export * from './globalsWhitelist'
export * from './looseEqual'
export * from './normalizeProp'
export * from './patchFlags'
export * from './shapeFlags'
export * from './slotFlags'
export * from './toDisplayString'
export * from './typeUtils'
export { makeMap }

/**
 * Object.freeze 是 冻结对象
 * 冻结的对象最外层无法修改。
 * 
 * process.env.NODE_ENV 是 node 项目中的一个环境变量，一般定义为：development 和production。
 * 
 * 根据环境写代码。比如开发环境，有报错等信息，生产环境则不需要这些报错警告。
 * 
 * __DEV__ 不是一个真实存在的变量。它在JS代码编译阶段，会被一个常量来替换，
 * 通常在 development 下是 true，在 production 模式下是 false。
 */
export const EMPTY_OBJ: { readonly [key: string]: any } = __DEV__
  ? Object.freeze({})
  : {}
export const EMPTY_ARR = __DEV__ ? Object.freeze([]) : []

// NOOP 空函数
// 很多库的源码中都有这样的定义函数，比如 jQuery、underscore、lodash 等
// 使用场景：1. 方便判断， 2. 方便压缩
export const NOOP = () => {}

/**
 * Always return false.
 * 除了压缩代码的好处外，一直返回 false
 */
export const NO = () => false

// 判断字符串是不是 on 开头，并且 on 后首字母不是小写字母
const onRE = /^on[^a-z]/
export const isOn = (key: string) => onRE.test(key)

// 判断字符串是不是以onUpdate:开头
export const isModelListener = (key: string) => key.startsWith('onUpdate:')

// extend 继承 合并 ，Object.assign简写成extend
export const extend = Object.assign

// 移除一项
export const remove = <>(arr: T[], el: T) => {
  const i = arr.indexOf(el)
  if (i > -1) {
    arr.splice(i, 1)
  }
}

// hasOwn 判断是不是自己本身所拥有的属性,不通过原型链向上查找的。
const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (
  val: object,
  key: string | symbol
): key is keyof typeof val => hasOwnProperty.call(val, key)

export const isArray = Array.isArray
export const isMap = (val: unknown): val is Map<any, any> =>
  toTypeString(val) === '[object Map]'
export const isSet = (val: unknown): val is Set<any> =>
  toTypeString(val) === '[object Set]'

export const isDate = (val: unknown): val is Date => val instanceof Date
export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string =>
  objectToString.call(value)

export const toRawType = (value: unknown): string => {
  // extract "RawType" from strings like "[object RawType]"
  return toTypeString(value).slice(8, -1)
}

export const isPlainObject = (val: unknown): val is object =>
  toTypeString(val) === '[object Object]'

// 判断是不是数字型的字符串key值
export const isIntegerKey = (key: unknown) =>
  isString(key) &&
  key !== 'NaN' &&
  key[0] !== '-' &&
      '' + parseInt(key, 10) === key
      
// 判断是否为保留prop
export const isReservedProp = /*#__PURE__*/ makeMap(
  // the leading comma is intentional so empty string "" is also included
  // 前面的逗号是故意的，所以空字符串''也包括在内  
  ',key,ref,ref_for,ref_key,' +
    'onVnodeBeforeMount,onVnodeMounted,' +
    'onVnodeBeforeUpdate,onVnodeUpdated,' +
    'onVnodeBeforeUnmount,onVnodeUnmounted'
)

// 判断是否为内部指令
export const isBuiltInDirective = /*#__PURE__*/ makeMap(
  'bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo'
)

//
/** 
 * 缓存，类似单例模式实现
 * Tips:
    var getSingle = function(fn){ // 获取单例
      var result;
      return function(){
          return result || (result = fn.apply(this, arguments));
      }
    };
*/
const cacheStringFunction = < extends (str: string) => string>(fn: T): T => {
  const cache: Record<string, string> = Object.create(null)
  return ((str: string) => {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }) as any
}

// \w 是 0-9a-zA-Z_ 数字 大小写字母和下划线组成
// () 小括号是 分组捕获
const camelizeRE = /-(\w)/g
/**
 * @private
 * 连字符转为驼峰
 * on-click => onClick 
 * ab-cd-ef => abCdEf
 */
export const camelize = cacheStringFunction((str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
})
// \B 是指 非 \b 单词边界。
// \B是-，([A-Z])是-后的首字母
const hyphenateRE = /\B([A-Z])/g
/**
 * @private
 * 驼峰转为连字符
 * onClick => on-click
 */
export const hyphenate = cacheStringFunction((str: string) =>
  str.replace(hyphenateRE, '-$1').toLowerCase()
)

/**
 * @private
 * 首字母转大写
 */
export const capitalize = cacheStringFunction(
  (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
)

/**
 * @private
 * click => onClick
 */
export const toHandlerKey = cacheStringFunction((str: string) =>
  str ? `on${capitalize(str)}` : ``
)

// compare whether a value has changed, accounting for NaN.
// 比较一个值是否发生了变化，核算出NaN。
// Object.is 认为  NaN 和 本身 相比 是同一个值
// 与严格比较运算符（===）的行为基本一致。 
// 不同之处只有两个：一是+0不等于-0，而是 NaN 等于自身。
export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue)

// 数组中存放函数，方便统一执行多个函数，且传入统一参数
export const invokeArrayFns = (fns: Function[], arg?: any) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg)
  }
}

// def 定义对象属性
/**

ES5中引入了属性描述符的概念，我们可以通过它对所定义的属性有更大的控制权。这些属性描述符（特性）包括：

value——当试图获取属性时所返回的值。
writable——该属性是否可写。
enumerable——该属性在for in循环中是否会被枚举。
configurable——该属性是否可被删除。
set()——该属性的更新操作所调用的函数。
get()——获取属性值时所调用的函数。

另外，数据描述符（其中属性为：enumerable，configurable，value，writable）
与存取描述符（其中属性为enumerable，configurable，set()，get()）之间是有互斥关系的。
在定义了set()和get()之后，描述符会认为存取操作已被定义了，其中再定义value和writable会引起错误。

*/
export const def = (obj: object, key: string | symbol, value: any) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  })
}

//

/**
toNumber 转数字

Tips:
Number.isNaN(NaN);        // true
Number.isNaN(Number.NaN); // true
Number.isNaN(0 / 0)       // true

// 下面这几个如果使用全局的 isNaN() 时，会返回 true。
Number.isNaN("NaN");      // false，字符串 "NaN" 不会被隐式转换成数字 NaN。
Number.isNaN(undefined);  // false
Number.isNaN({});         // false
Number.isNaN("blabla");   // false


Number.isNaN = Number.isNaN || function(value) {
  return typeof value === "number" && isNaN(value);
}
*/
export const toNumber = (val: any): any => {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}

    // 获取全局 this 指向。
let _globalThis: any
export const getGlobalThis = (): any => {
  return (
    _globalThis ||
    (_globalThis =
      typeof globalThis !== 'undefined'
        ? globalThis
        : typeof self !== 'undefined'
        ? self
        : typeof window !== 'undefined'
        ? window
        : typeof global !== 'undefined'
        ? global
        : {})
  )
}
