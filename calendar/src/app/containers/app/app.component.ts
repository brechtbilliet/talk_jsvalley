import { Component } from '@angular/core';
import { VIEW_MODE } from '../../constants';
import * as moment from 'moment';
import { Appointment } from '../../types/appointment.type';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
    selector: 'app-root',
    template: `
<topbar
    (next)="onNext()"
    (previous)="onPrevious()"
    (setViewMode)="onSetViewMode($event)"
    (searchChanged)="onSearchChanged($event)"
    [calendarLabel]="calendarLabel"
></topbar>
<div [ngSwitch]="viewMode$|async">
    <day-view 
        *ngSwitchCase="VIEW_MODE.DAY"
        [appointments]="appointments"
        [date]="currentDate$|async"
        (removeAppointment)="onRemoveAppointment($event)"
        (addAppointment)="onAddAppointment($event)"
        (updateAppointment)="onUpdateAppointment($event)"
        >
    </day-view>
    <week-view 
        *ngSwitchCase="VIEW_MODE.WEEK"
        [appointments]="appointments"
        [year]="currentYear$|async"
        [week]="currentWeek$|async"
        (removeAppointment)="onRemoveAppointment($event)"
        (addAppointment)="onAddAppointment($event)"
        (updateAppointment)="onUpdateAppointment($event)"
        >
    </week-view>
    <month-view 
        *ngSwitchCase="VIEW_MODE.MONTH" 
        [month]="currentMonth$|async" 
        [year]="currentYear$|async"
        [appointments]="appointments"
        (removeAppointment)="onRemoveAppointment($event)"
        (addAppointment)="onAddAppointment($event)"
        (updateAppointment)="onUpdateAppointment($event)"
        >
    </month-view>
</div>
`,
})
export class AppComponent {
    VIEW_MODE = VIEW_MODE;
    viewMode$ = new BehaviorSubject(VIEW_MODE.MONTH);
    // --------(+1)----(+1)----(-1)-------------...
    navigation$ = new Subject<number>();
    searchTerm$ = new BehaviorSubject('');

    // -----MONTH---------------------YEAR------...
    // -----MONTH-------------------------------...
    // -----(d)---------------------------------...
    // --------(+1)----(+1)----(-1)-------------...
    // -----d---d-------d-------d-----d----------...
    currentDate$ = this.viewMode$.flatMap((viewMode: string) => {
        let date = moment().toDate();
        return this.navigation$
            .startWith(0)
            .scan((val, acc) => val + acc)
            .map((action: number) => {
                switch (viewMode){
                    case VIEW_MODE.MONTH:
                        return moment(date).add(action, "months");
                    case VIEW_MODE.WEEK:
                        return moment(date).add(action, "weeks");
                    case VIEW_MODE.DAY:
                        return moment(date).add(action, "days");
                }
                return date;
            })
    });

    currentYear$ = this.currentDate$.map(date => moment(date).year());
    currentMonth$ = this.currentDate$.map(date => moment(date).month());
    currentWeek$ = this.currentDate$.map(date => moment(date).week());

    appointments: Array<Appointment> = [];
    calendarLabel = "";

    onSetViewMode(viewMode: string): void {
        this.viewMode$.next(viewMode);
    }

    onPrevious(): void {
        this.navigation$.next(-1);
    }

    onNext(): void {
        this.navigation$.next(1);
    }

    onSearchChanged(e: string): void {
        this.searchTerm$.next(e);
    }

    onRemoveAppointment(appointment: Appointment): void {

    }

    onAddAppointment(date: Date): void {

    }

    onUpdateAppointment(appointment: Appointment): void {

    }
}
