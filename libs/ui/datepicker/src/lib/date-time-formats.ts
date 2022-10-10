import { MatDateFormats } from '@angular/material/core';

export const DATE_TIME_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'D.M.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
