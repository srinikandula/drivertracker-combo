import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { HttpService } from '@app/shared/services/http.service';
import { ApiUrlsService } from '@app/shared/services/api-urls.service';
import { AuthService } from '@app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  public loggedUserDetails: any;
  public loginForm: any = FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string | undefined;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private apiService: HttpService,
    private apiUrls: ApiUrlsService
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern(/^\d{10}$/),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  onSubmit(): void {
    console.log(this.loginForm.value);
    localStorage.clear();
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService
      .logIn(this.f.phoneNumber.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data) {
            this.loggedUserDetails = data;
            this.router.navigate([this.returnUrl]);
          }
        },
        (error: { message: string }) => {
          this.error = error.message;
          this.submitted = true;
        }
      );
  }
}
