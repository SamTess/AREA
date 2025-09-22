import { View, NavigatedData, Page, Observable } from '@nativescript/core'

const HTTP_CAT_CODES = [
  100, 101, 102, 103, 200, 201, 202, 204, 206, 300, 301, 302, 303, 304, 307,
  308, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413,
  414, 415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 429, 431, 451, 500,
  501, 502, 503, 504, 506, 507, 508, 510, 511,
]

function randomCode(): number {
  const i = Math.floor(Math.random() * HTTP_CAT_CODES.length)
  return HTTP_CAT_CODES[i]
}

function buildHttpCatUrl(code?: number): string {
  const c = code ?? randomCode()
  return `https://http.cat/${c}.jpg?t=${Date.now()}`
}

export function onNavigatingTo(args: NavigatedData) {
  const page = args.object as Page
  const vm = new Observable()
  vm.set('httpCatUrl', buildHttpCatUrl())
  page.bindingContext = vm
}

export function onGoTodos(args: any) {
  const page = (args.object as View).page as Page
  page.frame.navigate({
    moduleName: 'todos/todos-page',
    animated: true,
    transition: { name: 'slideLeft', duration: 200, curve: 'easeInOut' },
  })
}

export function onRefreshHttpCat(args: any) {
  const page = (args.object as View).page as Page
  const vm = page.bindingContext as Observable
  vm.set('httpCatUrl', buildHttpCatUrl())
}
