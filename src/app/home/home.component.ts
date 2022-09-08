import { InjectorService } from "./../services/injector.service";
import { Subscription } from "rxjs";
import { AfterViewInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  showToolbar: boolean;
  subscriptions: Subscription[];

  constructor(
    private injectorService: InjectorService,
    private cdr: ChangeDetectorRef
  ) {
    this.showToolbar = true;
    this.subscriptions = [];
  }
  ngAfterViewInit(): void {
    // sub to be told when new releases are being checked for
    /*
    this.subscriptions.push(
      this.injectorService.fullscreenSourceFound$.subscribe((msg) => {
        if (msg === "enabled") {
          this.showToolbar = false;
        } else {
          this.showToolbar = true;
        }
        this.cdr.detectChanges();
      })
    );*/
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
