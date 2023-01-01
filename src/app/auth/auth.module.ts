import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  imports: [SharedModule, AuthRoutingModule],
  declarations: [LoginComponent, RegisterComponent, ForgotPasswordComponent],
})
export class AuthModule {}
