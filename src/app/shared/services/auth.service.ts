import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiUrlsService } from '@app/shared/services/api-urls.service';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedUserSub: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private apiUrls: ApiUrlsService) {
    this.loggedUserSub = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('loggedUser') as string)
    );
    this.currentUser = this.loggedUserSub.asObservable();
  }

  public get currentUserValue(): any {
    return this.loggedUserSub.value;
  }

  public isAuthenticated(): string | null {
    return localStorage.getItem('loggedUser');
  }

  logIn(contactNumber: string, loginOtp: string) {
    return this.http
      .post<any>(this.apiUrls.mainUrl + '/api/v1/auth/otpLogin', {
        contactNumber,
        loginOtp,
      })
      .pipe(
        map(response => {
          if (response) {
            Swal.fire('Success', 'Login Success', 'success');
            localStorage.setItem('loggedUser', JSON.stringify(response));
            this.loggedUserSub.next(response);
          }
          return response;
        })
      );
  }

  logOut(): void {
    localStorage.clear();
    this.loggedUserSub.next(null);
  }
}
