import { InjectorService } from "./../services/injector.service";
import { Subscription } from "rxjs";
import { AfterViewInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  subscriptions: Subscription[];

  constructor(
    private injectorService: InjectorService,
    private cdr: ChangeDetectorRef
  ) {
    this.subscriptions = [];
  }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
