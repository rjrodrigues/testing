import { DATE_TIME_FORMATS } from './date-time-formats';
import { DatepickerComponent } from './component/datepicker.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { DateTimeAdapter } from './date-time-adapter';

@NgModule({
  declarations: [DatepickerComponent],
  exports: [DatepickerComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: DateTimeAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DATE_TIME_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'de-CH' },
  ],
})
export class DatepickerModule {}
