import { ApiService } from './../services/api.service';
import { Boned } from './../entities/manage-db';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogMessageUtils } from '../utilities/dialog-message-util';
import { LoginUtil } from '../utilities/login-util';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  navLinks = [
    {path: 'file-search', label: 'Search'},
  ];
  panelLinks = [
    {path: '', label: ''},
  ];
  dbStats!: Boned;  
  loading = true;
  lastUpdated = new Date();
  loginUtil = LoginUtil;
  userAvatar!: string;

  constructor( private router: Router, private apiService: ApiService) {
   }

  ngOnInit(): void {
    this.apiService.howBoned().subscribe({
      next: (stats) => {
        this.dbStats = stats;
      }
    })      
  }

  logoutUser(): void {
    this.loginUtil.clearStorage();
    this.router.navigate(['/login']);
  }

}
