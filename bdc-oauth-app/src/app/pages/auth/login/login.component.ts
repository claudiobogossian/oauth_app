import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { closeLoading, showLoading } from 'src/app/app.action';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Login } from '../auth.action';
import { Router } from '@angular/router';
import { ErrorMsg } from 'src/app/shared/helpers/interfaces';
import { UsersService } from '../../admin/users/users.service';

/**
 * login page component
 */
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public formLogin: FormGroup;
  public formRecover: FormGroup;
  public error: ErrorMsg;
  public view = 'login';

  constructor(
    private as: AuthService,
    private us: UsersService,
    private store: Store<AppState>,
    public router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder) {
      this.store.pipe(select('auth')).subscribe(res => {
        if (res.userId && res.token && res.grants) {
          this.router.navigate(['/admin/my']);
        }
      });

      this.formLogin = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]]
      });

      this.formRecover = this.fb.group({
        username: ['', [Validators.required]]
      });
  }

  public async login() {
    if (this.formLogin.status !== 'VALID') {
      this.error = {
        type: 'error',
        message: 'Fill in all fields!'
      };
    } else {
      try {
        this.store.dispatch(showLoading());

        const credentials = {
          username: this.formLogin.get('username').value,
          password: this.formLogin.get('password').value
        };
        const response = await this.as.login(credentials);
        this.store.dispatch(Login({
          userId: response.user_id,
          grants: response.grants,
          token: response.access_token,
          expired_date: response.expired_date
        }));
        this.error = null;
        this.router.navigate(['/admin/my']);
        
        this.snackBar.open('Login Successfully!', '', {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: 'app_snack-bar-success'
        });

      } catch (err) {
        const message = err.error.message ? err.error.message : 'Authentication Error!';
        this.error = {
          type: 'error',
          message
        };

      } finally {
        this.store.dispatch(closeLoading());
      }
    }
  }

  public async recover() {
    if (this.formRecover.status !== 'VALID') {
      this.error = {
        type: 'error',
        message: 'Fill in all fields!'
      };
    } else {
      try {
        this.store.dispatch(showLoading());

        const data = {
          username: this.formRecover.get('username').value
        };
        const response = await this.us.recoverPass(data);
        this.error = {
          type: 'warning',
          message: 'Check your spam!'
        };
        
        this.snackBar.open('We send a link to your email!', '', {
          duration: 10000,
          verticalPosition: 'top',
          panelClass: 'app_snack-bar-success'
        });

      } catch (err) {
        const message = err.error.message ? err.error.message : 'Error when trying to recover your password!';
        this.error = {
          type: 'error',
          message
        };

      } finally {
        this.store.dispatch(closeLoading());
      }
    }
  }

  public changeView(type: string) {
    this.view = type;
    this.error = null;
  }

}
