import { Component, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Appointment } from '../../types/appointment.type';
import { DayWithAppointments } from '../../types/day-with-appointments.type';

@Component({
    selector: 'month-view',
    template: `
        <h2>{{month + 1}}/{{year}}</h2>
        <table>
            <tr *ngFor="let week of (weeks$|async)">
                <td  *ngFor="let day of week">
                    <day-detail
                            (addAppointment)="addAppointment.emit($event)"
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
export class MonthViewComponent implements OnChanges {
    @Input() month: number;
    @Input() year: number;
    @Input() appointments: Array<Appointment>;

    @Output() public addAppointment = new EventEmitter<Appointment>();
    @Output() public updateAppointment = new EventEmitter<Appointment>();
    @Output() public removeAppointment = new EventEmitter<Appointment>();

    month$ = new ReplaySubject<number>();
    year$ = new ReplaySubject<number>();
    appointments$ = new ReplaySubject<Array<Appointment>>();

    weeks$ = Observable.combineLatest([this.month$, this.year$, this.appointments$],
        (month: number, year: number, appointments: Array<Appointment>) => {
            const dayOne = moment().year(year).month(month).date(1);
            const days = Array.from({length: dayOne.daysInMonth()}, (value, key) => key + 1);
            let res = _.groupBy(days, ((day: number) => moment().year(year).month(month).date(day).week()));
            return Object.keys(res)
                .map((key) => res[key])
                .map((days: Array<number>) => {
                    let week: Array<DayWithAppointments> = [null, null, null, null, null, null, null];
                    days.forEach(day => {
                        let date = moment().year(year).month(month).date(day).toDate();
                        week[moment().year(year).month(month).date(day).weekday()] = {
                            date: date,
                            appointments: appointments.filter((appointment: Appointment) => {
                                return moment().year(year).month(month).date(day).date() === moment(appointment.date).date();
                            })
                        };
                    });
                    return week;
                });
        });

    ngOnChanges(simpleChanges: any): void {
        if (simpleChanges.month && this.month !== null) {
            this.month$.next(this.month);
        }
        if (simpleChanges.year && this.year !== null) {
            this.year$.next(this.year);
        }
        if (simpleChanges.appointments && this.appointments !== null) {
            this.appointments$.next(this.appointments);
        }
    }
}