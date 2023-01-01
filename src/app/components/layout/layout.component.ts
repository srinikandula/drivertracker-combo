import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/shared/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  username: any = '';
  constructor(private authService: AuthService) {
    this.username = JSON.parse(localStorage.getItem('loggedUser') as string).username;
  }

  ngOnInit(): void {}

  logOut() {
    this.authService.logOut();
  }
}
