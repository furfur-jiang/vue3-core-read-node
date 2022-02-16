/**
 * Make a map and return a function for checking if a key
 * is in that map.
 * 创建一个map并返回一个函数来检查一个键是否在该map中。  
 * 
 * IMPORTANT: all calls of this function must be prefixed with
 * \/\*#\_\_PURE\_\_\*\/
 * So that rollup can tree-shake them if necessary.
 * 
 * 所有调用这个函数的时候都必须加上前缀，因此，如果有必要，rollup可以tree-shake。  
 */
export function makeMap(
  str: string,
  expectsLowerCase?: boolean //预期小写
): (key: string) => boolean {
  const map: Record<string, boolean> = Object.create(null)
  const list: Array<string> = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val]
}
