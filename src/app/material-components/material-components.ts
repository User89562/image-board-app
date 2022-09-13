import { MatMenuModule } from '@angular/material/menu';
import {NgModule} from '@angular/core';

// angular components
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule, MatTooltipDefaultOptions, MAT_TOOLTIP_DEFAULT_OPTIONS} from '@angular/material/tooltip';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatChipsModule} from '@angular/material/chips';
import {OverlayModule} from '@angular/cdk/overlay';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import {MatBadgeModule} from '@angular/material/badge';
import {ClipboardModule} from '@angular/cdk/clipboard'; 
import {ScrollingModule} from '@angular/cdk/scrolling'; 


// changes the default values of tooltips for the whole project
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 700,
  hideDelay: 300,
  touchendHideDelay: 1000,
};

@NgModule({
  exports: [
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatExpansionModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatToolbarModule,
    MatTabsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatBottomSheetModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatStepperModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatTableModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    OverlayModule,
    DragDropModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatBadgeModule,
    MatSortModule,
    ClipboardModule,
    ScrollingModule,
  ],
  providers: [
    {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults},
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['l', 'LL'],
        },
        display: {
          dateInput: 'L',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'L',
          monthYearA11yLabel: 'MM YYYY',
        },
      },
    },

  ],
})
export class MaterialComponents {}
