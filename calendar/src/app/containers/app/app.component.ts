import { Component } from '@angular/core';
import { VIEW_MODE } from '../../constants';
import * as moment from 'moment';
import { Appointment } from '../../types/appointment.type';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFire } from 'angularfire2';
import Moment = moment.Moment;


@Component({
    selector: 'app-root',
    template: `
        <topbar
                (next)="onNext()"
                (previous)="onPrevious()"
                (setViewMode)="onSetViewMode($event)"
                (searchChanged)="onSearchChanged($event)">
        </topbar>
        <div [ngSwitch]="null">
            <day-view
                    *ngSwitchCase="VIEW_MODE.DAY"
                    [appointments]="[]"
                    [date]="null"
                    (removeAppointment)="onRemoveAppointment($event)"
                    (addAppointment)="onAddAppointment($event)"
                    (updateAppointment)="onUpdateAppointment($event)">
            </day-view>
            <week-view
                    *ngSwitchCase="VIEW_MODE.WEEK"
                    [appointments]="[]"
                    [year]="null"
                    [week]="null"
                    (removeAppointment)="onRemoveAppointment($event)"
                    (addAppointment)="onAddAppointment($event)"
                    (updateAppointment)="onUpdateAppointment($event)">
            </week-view>
            <month-view
                    *ngSwitchCase="VIEW_MODE.MONTH"
                    [month]="null"
                    [year]="null"
                    [appointments]="[]"
                    (removeAppointment)="onRemoveAppointment($event)"
                    (addAppointment)="onAddAppointment($event)"
                    (updateAppointment)="onUpdateAppointment($event)">
            </month-view>
        </div>
    `,
})
export class AppComponent {
    VIEW_MODE = VIEW_MODE;

    // viewMode$:     month------------week-----------month-------...
    viewMode$ = new BehaviorSubject(VIEW_MODE.MONTH);

    // navigation$:   0----(+1)----(+1)----(-1)-------------(+1)--...
    navigation$ = new BehaviorSubject<number>(0);

    // navigation$:   ''-----'a'-----'ab'------'abc'--------------...
    searchTerm$ = new BehaviorSubject('');

    // appointments$:   --[]---[ab]-----[abcd]-----[abc]----------...
    appointments$ = this.af.database.list('/appointments');

    // viewMode$:     month------------week-----------month-------...
    // navigation$:   0----(+1)----(+1)----(-1)-------------(+1)--...
    // currentDateM$: 1/4--1/5-----1/6-1/4--27/3------1/4---1/5---...
    currentDateM$ = this.viewMode$.flatMap((viewMode: string) => {
        let dateM = moment();
        return this.navigation$
            .map((action: number) => {
                switch (viewMode) {
                    case VIEW_MODE.MONTH:
                        return dateM.startOf('month').add(action, "months");
                    case VIEW_MODE.WEEK:
                        return dateM.startOf('week').add(action, "weeks");
                    case VIEW_MODE.DAY:
                        return dateM.startOf('day').add(action, "days");
                }
                return dateM;
            })
    }).publishReplay(1).refCount();

    // todo: currentDate$
    // todo: currentWeek$
    // todo: currentMonth$
    // todo: currentYear$
    // todo: filteredAppointments$

    constructor(private af: AngularFire) {
    }

    private filterByTerm(appointment: Appointment, term: string): boolean {
        return appointment.description.toLowerCase().indexOf(term.toLowerCase()) > -1;
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
        this.af.database.object('appointments/' + appointment.$key).set({
            description: appointment.description,
            date: appointment.date
        });
    }
}
