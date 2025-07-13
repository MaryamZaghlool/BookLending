import {Component} from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

/**
 * @title Basic progress-spinner
 */
@Component({
  selector: 'app-spinner',
  templateUrl: 'spinner.component.html',
  imports: [MatProgressSpinnerModule],
})
export class ProgressSpinnerOverviewExample {}
