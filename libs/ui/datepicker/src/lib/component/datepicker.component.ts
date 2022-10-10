import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  Self,
  SimpleChanges,
} from '@angular/core';

import {
  ControlValueAccessor,
  NgControl,
  UntypedFormControl,
} from '@angular/forms';

import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { datetime } from '@app/shared/datetime';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
})
export class DatepickerComponent
  implements OnInit, OnChanges, ControlValueAccessor
{
  @Input()
  value?: Date;

  @Input()
  disabled?: boolean;

  @Input()
  set disableWeekend(disable: boolean) {
    this.dateFilter = this.weekendFilter(disable);
  }

  @Input()
  minDate?: Date;

  @Input()
  maxDate?: Date;

  @Input() label = 'DD.MM.YYYY';

  @Output()
  valueChange: EventEmitter<Date>;

  dateFilter: (date: Date) => boolean;

  formControl: UntypedFormControl;

  public weekendDisabled: boolean; // for cypress tests

  constructor(@Self() @Optional() private readonly ngControl: NgControl) {
    console.log('ngControl: ', ngControl);
    if (ngControl) {
      ngControl.valueAccessor = this;
    }

    this.valueChange = new EventEmitter<Date>();
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    if (this.ngControl?.control) {
      this.formControl = this.ngControl.control as UntypedFormControl;

      if (this.formControl.value) {
        this.formControl.setValue(new Date(this.formControl.value));
      }

      if (this.disabled) {
        this.formControl.disable();
      }
    } else {
      this.formControl = new UntypedFormControl({
        value: this.value,

        disabled: this.disabled,
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.formControl) {
      if (changes['value']) {
        this.formControl.setValue(changes['value'].currentValue);
      }

      if (changes['disabled']) {
        changes['disabled'].currentValue
          ? this.formControl.disable()
          : this.formControl.enable();
      }
    }
  }

  onDateChange(change: MatDatepickerInputEvent<Date>) {
    if (change.value) {
      this.valueChange.emit(change.value);
    }
  }

  writeValue(value: Date): void {
    // do nothing
  }

  registerOnChange(fn: any): void {
    // do nothing
  }

  registerOnTouched(fn: any): void {
    // do nothing
  }

  weekendFilter(disableWeekend: boolean): (date: Date) => boolean {
    return (date) => {
      this.weekendDisabled = disableWeekend;

      if (disableWeekend) {
        const day = datetime(date).day();

        return day !== 0 && day !== 6;
      } else {
        return true;
      }
    };
  }
}
