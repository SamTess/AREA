import { Component, ViewChild, HostListener, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { newTaskComponent } from './new-task.component';
import {MatSidenavModule, MatSidenav} from '@angular/material/sidenav';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './toDoList.component.html',
  styleUrls: ['./toDoList.component.css'],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatPaginatorModule
  ],
  standalone: true
})

export class ToDoListComponent implements AfterViewInit {
  tasks: Array<{ title: string; date?: Date | null }> = [
    { title: 'Task 1', date: new Date('2022-04-28') },
    { title: 'Task 2', date: new Date('2022-04-29') },
    { title: 'Task 3', date: new Date('2022-04-30') },
        { title: 'Task 1', date: new Date('2022-04-28') },
    { title: 'Task 2', date: new Date('2022-04-29') },
    { title: 'Task 3', date: new Date('2022-04-30') },


  ];

  dataSource = new MatTableDataSource<{ title: string; date?: Date | null }>(this.tasks);
  pageSize: number = Math.min(5, this.tasks.length || 1);

  displayedColumns: string[] = ['title', 'date', 'actions'];
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  sidenavMode: 'side' | 'over' = 'side';
  sidenavWidth: string = '420px';
  sidenavBg: string = '#ffffffff'; // variable tmp
  isBrowser: boolean = false;

  newTitle: string = '';
  newDueDate: Date | null = null;

  constructor(private dialog: MatDialog, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.updateSidenavForWidth(window.innerWidth);
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.updatePageSize();
    }
  }

  ngOnDestroy(): void {
    // rien
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (!this.isBrowser) return;
    this.updateSidenavForWidth(event.target?.innerWidth ?? window.innerWidth);
  }

  private updateSidenavForWidth(width: number) {
    if (width >= 1024) {
      this.sidenavMode = 'side';
      const pct = Math.round(width * 0.25);
      this.sidenavWidth = Math.min(pct, 480) + 'px';
    } else if (width >= 600) {
      this.sidenavMode = 'side';
      this.sidenavWidth = Math.min(Math.round(width * 0.33), 420) + 'px';
    } else {
      this.sidenavMode = 'over';
      this.sidenavWidth = Math.min(Math.round(width * 0.9), width) + 'px';
    }

    this.sidenavBg = '#fff7f9'; // couleur bg
  }

  addTask(newTask: string): void {
    if (newTask) {
      this.tasks.push({ title: newTask, date: null });
      this.dataSource.data = this.tasks;
      this.updatePageSize();
    }
  }

  markAsDone(index: number): void {
    this.tasks.splice(index, 1);
    this.dataSource.data = this.tasks;
    this.updatePageSize();
  }

  removeTask(index: number): void {
    this.tasks.splice(index, 1);
    this.dataSource.data = this.tasks;
    this.updatePageSize();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(newTaskComponent, {
      height: '400px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.title) {
        this.tasks.push({ title: result.title, date: result.date ?? null });
        this.dataSource.data = this.tasks;
        this.updatePageSize();
      }
    });
  }

  openCreateSidenav(): void {
    this.newTitle = '';
    this.newDueDate = null;
    this.sidenav.open();
  }

  cancelSidenav(): void {
    this.sidenav.close();
  }

  saveFromSidenav(): void {
    if (!this.newTitle) {
      return;
    }
    this.tasks.push({ title: this.newTitle, date: this.newDueDate ?? null });
    this.dataSource.data = this.tasks;
    this.updatePageSize();
    this.sidenav.close();
  }

  private updatePageSize(): void {
    const len = this.dataSource.data?.length ?? 0;
    this.pageSize = len > 0 ? Math.min(5, len) : 1;
    if (this.paginator) {
      this.paginator.length = len;
      this.paginator.pageSize = this.pageSize;
    }
  }
}