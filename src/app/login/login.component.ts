import { ApiService } from "./../services/api.service";
import { Component, OnInit } from "@angular/core";
import { Validators, UntypedFormBuilder } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment.prod";
import { LoginForm } from "../entities/login";
import { LoginUtil } from "../utilities/login-util";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  message: string;
  hide = true;
  loggingIn = false;
  loginUtil = LoginUtil;
  title = environment.app_name;
  accessCode!: string;
  loginForm = this.fb.group({
    apiUrl: ["", Validators.required],
    apiKey: ["", Validators.required],
  });
  loginError: string;

  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    titleService: Title,
    private apiService: ApiService
  ) {
    this.message = "";
    this.loginError = "";
    titleService.setTitle("Login | " + environment.app_name);
  }

  ngOnInit(): void {
    this.determineAuth();
  }

  determineAuth(): void {
    const key = this.loginUtil.retrieveKey();
    const api = this.loginUtil.retrieveUrl();

    if (!(key == "" && api == "")) {
      this.apiService.verifyAccess(api, key).subscribe({
        next: (result) => {
          this.loggingIn = true;
          setTimeout(() => this.router.navigate(["/file-search"]), 700);
        },
      });
    }

    // check if logged in
  }

  login() {
    this.message = "Trying to log in ...";
  }

  onKey(event: any) {
    if (event.key === "Enter" && this.loginForm.valid) {
      this.onSubmit(this.loginForm.value);
    }
  }

  logout() {
    this.message = "Successfully logged out";
  }

  onSubmit(formValues: LoginForm): void {
    this.apiService
      .verifyAccess(formValues.apiUrl, formValues.apiKey)
      .subscribe({
        next: (result) => {
          this.loginUtil.addToStorage(formValues.apiUrl, formValues.apiKey);
          this.loggingIn = true;
          setTimeout(() => this.router.navigate(["/file-search"]), 700);
        },
        error: (e) => {
          this.loginError =
            "Unable to login - Incorrect access or url doesn't exisit";
        },
      });
  }
}
