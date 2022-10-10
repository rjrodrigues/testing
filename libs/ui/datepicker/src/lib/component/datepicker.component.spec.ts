// @ts-nocheck
import { render } from '@testing-library/angular';
import { DatepickerModule } from '../datepicker.module';
import { DatepickerComponent } from './datepicker.component';
import {
  NgControl,
  UntypedFormControl,
  FormsModule,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { TestBed } from '@angular/core/testing';

describe('DatepickerComponent', () => {
  const setup = async () => {
    const NG_CONTROL_PROVIDER = {
      provide: NgControl,
      useClass: class extends NgControl {
        control = new UntypedFormControl({
          value: new Date(),
          disabled: false,
        });
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        viewToModelUpdate() {}
      },
    };

    const renderedComponent = render(DatepickerComponent, {
      imports: [DatepickerModule, FormsModule],
      providers: [NG_CONTROL_PROVIDER],
      excludeComponentDeclaration: true,
    });

    return renderedComponent;
  };

  it('should instantiate', async () => {
    const renderResult = await setup();
    expect(renderResult.fixture.componentInstance).toBeInstanceOf(
      DatepickerComponent
    );
  });

  it('should instantiate', async () => {
    const renderResult = await setup();
    expect(renderResult.fixture.componentInstance.formControl.value).not.toBe(
      undefined
    );
  });
});

fdescribe('DatepickerComponent TestBed', () => {
  let datepickerComponent: DatepickerComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatepickerComponent],
      imports: [FormsModule, ReactiveFormsModule],
    });
    const fixture = TestBed.inject(DatepickerComponent);
    fixture.ngControl = new FormControl();
    datepickerComponent = TestBed.inject(DatepickerComponent);

    // const NG_CONTROL_PROVIDER = {
    //   provide: NgControl,
    //   useClass: class extends NgControl {
    //     control = new FormControl();
    //     // eslint-disable-next-line @typescript-eslint/no-empty-function
    //     viewToModelUpdate() {}
    //   },
    // };
    // await TestBed.configureTestingModule({
    //   providers: [DatepickerComponent],
    //   imports: [FormsModule, ReactiveFormsModule],
    // })
    //   .overrideComponent(DatepickerComponent, {
    //     add: { providers: [NG_CONTROL_PROVIDER] },
    //   })
    //   .compileComponents();
  });

  it('should instanciate', () => {
    expect(datepickerComponent).not.toBe(null);
  });

  it('should have a value', () => {
    datepickerComponent.ngOnInit();
    expect(datepickerComponent.formControl).not.toBe(undefined);
  });
});
