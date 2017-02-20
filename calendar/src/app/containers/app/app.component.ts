import { Component, OnInit } from '@angular/core';
import { VIEW_MODE } from '../../constants';
import * as moment from 'moment';
import { Appointment } from '../../types/appointment.type';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFire } from 'angularfire2';

@Component({
    selector: 'app-root',
    template: `
<topbar
    (next)="onNext()"
    (previous)="onPrevious()"
    (setViewMode)="onSetViewMode($event)"
    (searchChanged)="onSearchChanged($event)"
></topbar>
<div [ngSwitch]="viewMode$|async">
{{currentWeek$|async}}
{{currentMonth$|async}}
{{currentYear$|async}}
    <day-view 
        *ngSwitchCase="VIEW_MODE.DAY"
        [appointments]="filteredAppointments$|async"
        [date]="currentDate$|async"
        (removeAppointment)="onRemoveAppointment($event)"
        (addAppointment)="onAddAppointment($event)"
        (updateAppointment)="onUpdateAppointment($event)"
        >
    </day-view>
    <week-view 
        *ngSwitchCase="VIEW_MODE.WEEK"
        [appointments]="filteredAppointments$|async"
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
        [appointments]="filteredAppointments$|async"
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
    navigation$ = new BehaviorSubject<number>(0);
    searchTerm$ = new BehaviorSubject('');

    // -----MONTH---------------------YEAR------...
    // -----MONTH-------------------------------...
    // -----(d)---------------------------------...
    // --------(+1)----(+1)----(-1)-------------...
    // -----d---d-------d-------d-----d----------...
    currentDate$ = this.viewMode$.flatMap((viewMode: string) => {
        let date = moment().toDate();
        return this.navigation$
            .scan((val, acc) => val + acc)
            .map((action: number) => {
                console.log(action);
                switch (viewMode) {
                    case VIEW_MODE.MONTH:
                        return moment(date).startOf('month').add(action, "months");
                    case VIEW_MODE.WEEK:
                        return moment(date).startOf('week').add(action, "weeks");
                    case VIEW_MODE.DAY:
                        return moment(date).startOf('day').add(action, "days");
                }
                return date;
            })
    }).share();

    currentYear$ = this.currentDate$.map(date => moment(date).year());
    currentMonth$ = this.currentDate$.map(date => moment(date).month());
    currentWeek$ = this.currentDate$.map(date => moment(date).week());

    appointments$ = this.af.database.list('/appointments');
    filteredAppointments$ = Observable.combineLatest([this.viewMode$, this.currentDate$, this.appointments$],
        (viewMode: string, currentDate: Date, appointments: Array<Appointment>) => {
            let currentDateM = moment(currentDate), formatted: string;
            switch (viewMode) {
                case VIEW_MODE.MONTH:
                    formatted = currentDateM.format('MM/YYYY');
                    return appointments.filter(item => moment(item.date).format('MM/YYYY') === formatted);
                case VIEW_MODE.WEEK:
                    formatted = currentDateM.format('ww/YYYY');
                    return appointments.filter(item => moment(item.date).format('ww/YYYY') === formatted);
                case VIEW_MODE.DAY:
                    formatted = currentDateM.format('DD/MM/YYYY');
                    return appointments.filter(item => moment(item.date).format('DD/MM/YYYY') === formatted);
            }
        }).share();

    constructor(private af: AngularFire) {
        af.auth.login({email: 'johndoe@test.com', password: 'testtest'});
    }

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

    onRemoveAppointment(id: string): void {
        this.appointments$.remove(id);
    }

    onAddAppointment(date: Date): void {
        this.appointments$.push(new Appointment(date.toDateString(), ''));
    }

    onUpdateAppointment(appointment: Appointment): void {

    }
}
