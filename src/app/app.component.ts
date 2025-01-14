import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'angular-ssr';
  message: string = 'Checking Content Security Policy... Please check your browser console.'

  ngOnInit(): void {
    console.log('If you are seeing this, your server is secured with CSP nonce! Great work!');
  }

}
