import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class HistoryComponent {

  @Input() years: Array<any> | undefined;

}
