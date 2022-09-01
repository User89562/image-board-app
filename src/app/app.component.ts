import { environment } from 'src/environments/environment.prod';
import { Title } from '@angular/platform-browser';
import { ApiService } from './services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private apiService: ApiService, titleService: Title) {
    titleService.setTitle(environment.app_name);
  }

  ngOnInit(): void {}
}
