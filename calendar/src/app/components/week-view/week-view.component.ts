import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Appointment } from '../../types/appointment.type';
import * as moment from 'moment';
import { DayWithAppointments } from '../../types/day-with-appointments.type';
@Component({
    selector: 'week-view',
    template: `
        <h2>Week: {{week}}/{{year}}</h2>
        <table>
            <tr>
                <td *ngFor="let day of days">
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

    days: Array<DayWithAppointments> = [];

    ngOnChanges(simpleChanges: any): void {
        if(this.week && this.year){
            this.days = this.calculateDaysWithAppointments(this.week, this.year, this.appointments || []);
        }
    }

    private calculateDaysWithAppointments(week: number, year: number, appointments: Array<Appointment>): Array<DayWithAppointments>{
        let sundayM = moment().year(year).week(week).startOf("week");
        return Array.from({length: 7}, () => null)
            .map((val, i) => {
                return {
                    date: sundayM.add(i, "days").toDate(),
                    appointments: appointments.filter((appointment: Appointment) => {
                        return sundayM.weekday(i).date() === moment(appointment.date).date();
                    })
                }
            });
    }
}