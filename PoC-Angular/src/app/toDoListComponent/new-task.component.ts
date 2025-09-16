import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-profile-dialog',
  templateUrl: './new-task.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
})
export class newTaskComponent {
  title: string = '';
  dueDate: Date | null = null;

  constructor(private dialogRef: MatDialogRef<newTaskComponent>) {}

  save() {
    if (!this.title) {
      return;
    }
    this.dialogRef.close({ title: this.title, date: this.dueDate });
  }

  cancel() {
    this.dialogRef.close();
  }
}
