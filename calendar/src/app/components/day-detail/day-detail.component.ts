import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Appointment } from '../../types/appointment.type';
@Component({
    selector: 'day-detail',
    template: `<md-card *ngIf="date">
    {{date | date: "d/M"}}&nbsp;
    <md-card-content>
        <table>
            <tr *ngFor="let appointment of appointments"  [mdTooltipPosition]="'before'" mdTooltip="{{appointment.description}}">
                <td>{{appointment.date|date: "hh:mm"}}</td>
                <td>
                    <button md-mini-fab color="warn">
                        <md-icon>delete</md-icon>
                    </button>
                </td>
            </tr>
        </table>
    </md-card-content>
    <md-card-actions>
        <button md-button color="primary" class="button-block" (click)="add()">
            <md-icon>add</md-icon>
        </button>
    </md-card-actions>
</md-card>
`
})
export class DayDetailComponent {
    @Input() date: Date;
    @Input() appointments: Array<Appointment>;

    @Output() public addAppointment = new EventEmitter<Date>();
    @Output() public updateAppointment = new EventEmitter<Appointment>();
    @Output() public removeAppointment = new EventEmitter<Appointment>();


    add(): void{
        this.addAppointment.emit(new Date());
    }

}