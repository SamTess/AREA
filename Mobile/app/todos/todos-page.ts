import { NavigatedData, Page, EventData, View } from '@nativescript/core'
import { TodosViewModel } from './todos-view-model'

let vm: TodosViewModel

export function onNavigatingTo(args: NavigatedData) {
  const page = args.object as Page
  if (!vm) vm = new TodosViewModel()
  page.bindingContext = vm
}

export function onAdd() {
  vm.addTodo()
}

export function onToggle(args: EventData) {
  const view = args.object as View
  const item = view.bindingContext as any
  vm.toggle(item.id)
}

export function onDelete(args: EventData) {
  const view = args.object as View
  const item = view.bindingContext as any
  vm.remove(item.id)
}

export function onClearCompleted() {
  vm.clearCompleted()
}

export function onGoHome(args?: EventData) {
  const view = (args?.object as View) || undefined
  const page = view?.page
  if (page) {
    page.frame.navigate({
      moduleName: 'home/home-items-page',
      animated: true,
      transition: { name: 'slideRight', duration: 180, curve: 'easeInOut' },
    })
  }
}
