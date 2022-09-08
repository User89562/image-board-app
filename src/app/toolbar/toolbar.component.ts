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
  
  loading = true;
  dialogUtils: DialogMessageUtils;
  lastUpdated = new Date();
  loginUtil = LoginUtil;
  userAvatar!: string;

  constructor(dialog: MatDialog, private router: Router) {
    this.dialogUtils = new DialogMessageUtils(dialog);
   }

  ngOnInit(): void {
      
  }

  logoutUser(): void {
    this.loginUtil.clearStorage();
    this.router.navigate(['/login']);
  }

}
