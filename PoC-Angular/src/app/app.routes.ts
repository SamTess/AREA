import { Routes } from '@angular/router';
import { ToDoListComponent } from './toDoListComponent/toDoList.component';
import { Home } from './home/home';
import { CreateProfile } from './create-profile/create-profile'

export const routes: Routes = [
  { path: '', component: Home},
  { path: 'home', component: Home },
  { path: 'todo-list', component: ToDoListComponent },
  { path: 'create-profile', component: CreateProfile}
];