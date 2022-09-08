import { environment } from 'src/environments/environment.prod';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(titleService: Title) {
    titleService.setTitle(environment.app_name);
  }

  ngOnInit(): void {}
}
