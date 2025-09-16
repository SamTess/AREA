import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToDoListComponent } from './toDoListComponent/toDoList.component';
import { HeaderComponent } from './header/header.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('PoC-Angular');
}
