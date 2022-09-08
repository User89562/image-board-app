import { ApiService } from "./../services/api.service";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
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
export class LoginComponent implements OnInit, AfterViewInit {
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
  logo: string;

  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    titleService: Title,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    this.message = "";
    this.loginError = "";
    this.logo = "/assets/app-logos/app-logo.png";
    titleService.setTitle("Login | " + environment.app_name);
  }
  ngAfterViewInit(): void {
    this.logo = this.determineLoginLogo();
    this.cdr.detectChanges();
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

  determineLoginLogo(): string {
    const path = "assets/app-logos/";
    const images = [
      "app-logo.png",
      "app-logo2.png",
      "app-logo3.png",
      "app-logo4.png",
      "app-logo5.png",
      "app-logo6.png",
      "app-logo7.png",
      "app-logo8.png",
      "app-logo9.png",
      "app-logo10.png",
      "app-logo11.png",
      "app-logo12.png",
      "app-logo13.png",
    ];
    let index = Math.floor(Math.random() * (images.length - 1 - 0 + 1) + 0);

    return path + images[index];
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
