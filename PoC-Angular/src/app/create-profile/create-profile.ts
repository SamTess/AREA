import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-create-profile',
  imports: [
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterModule
  ],
  templateUrl: './create-profile.html',
  styleUrls: ['./create-profile.css']
})

export class CreateProfile implements OnInit {
  isLinear = false;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;

  constructor(private _fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.firstFormGroup = this._fb.group({
      firstCtrl: ['', Validators.required]
    });

    this.secondFormGroup = this._fb.group({
      secondCtrl: ['', Validators.required]
    });
  }

  goToHome(): void {
    this.router.navigate(['']);
  }
}
