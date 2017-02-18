import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Appointment } from '../../types/appointment.type';
@Component({
    selector: 'day-view',
    template: `
        <day-detail
                (addAppointment)="addAppointment.emit($event)"
                (removeAppointment)="removeAppointment.emit($event)"
                (updateAppointment)="updateAppointment.emit($event)"
                [date]="date"
                [appointments]="appointments">
        </day-detail>
        
`
})
export class DayViewComponent implements OnChanges {
    @Input() date: Date;
    @Input() appointments: Array<Appointment>;

    @Output() public addAppointment = new EventEmitter<Date>();
    @Output() public updateAppointment = new EventEmitter<Appointment>();
    @Output() public removeAppointment = new EventEmitter<Appointment>();

    ngOnChanges(): void {

    }
}