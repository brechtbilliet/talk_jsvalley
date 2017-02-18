import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Appointment } from '../../types/appointment.type';
import { ReplaySubject, Observable } from 'rxjs';
import * as moment from 'moment';
import { DayWithAppointments } from '../../types/day-with-appointments.type';
@Component({
    selector: 'week-view',
    template: `
        <table>
            <tr>
                <td *ngFor="let day of (days$|async)">
                    <day-detail
                            (addAppointment)="addAppointment.emit(Date)"
                            (removeAppointment)="removeAppointment.emit($event)"
                            (updateAppointment)="updateAppointment.emit($event)"
                            [date]="day?.date"
                            [appointments]="day?.appointments">
                    </day-detail>
                </td>
            </tr>
        </table>
                
`
})
export class WeekViewComponent implements OnChanges {
    @Input() week: number;
    @Input() year: number;
    @Input() appointments: Array<Appointment>;

    @Output() public addAppointment = new EventEmitter<Appointment>();
    @Output() public updateAppointment = new EventEmitter<Appointment>();
    @Output() public removeAppointment = new EventEmitter<Appointment>();

    week$ = new ReplaySubject<number>();
    year$ = new ReplaySubject<number>();
    appointments$ = new ReplaySubject<Array<Appointment>>();


    days$ = Observable.combineLatest([this.week$, this.year$, this.appointments$],
        (week: number, year: number, appointments: Array<Appointment>) => {
            let days: Array<DayWithAppointments> = [];
            let momentWeek = moment().year(year).week(week);
            for (let i = 0; i < 7; i++) {
                let sunday = momentWeek.startOf("week");
                days.push({
                    date: sunday.add(i, "days").toDate(),
                    appointments: appointments.filter((appointment: Appointment) => {
                        return moment().year(year).week(week).weekday(i).date() === moment(appointment.date).date();
                    })
                });
            }
            return days;
        });

    ngOnChanges(simpleChanges: any): void {
        if (simpleChanges.week && this.week) {
            this.week$.next(this.week);
        }
        if (simpleChanges.year && this.year) {
            this.year$.next(this.year);
        }
        if (simpleChanges.appointments && this.appointments) {
            this.appointments$.next(this.appointments);
        }
    }
}