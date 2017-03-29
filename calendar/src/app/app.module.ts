import 'rxjs';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { AppComponent } from './containers/app/app.component';
import { DayViewComponent } from './components/day-view/day-view.component';
import { WeekViewComponent } from './components/week-view/week-view.component';
import { MonthViewComponent } from './components/month-view/month-view.component';
import { DayDetailComponent } from './components/day-detail/day-detail.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';


export const firebaseConfig = {
    apiKey: "AIzaSyCepO_WGqPwAXqEWIGnC9lgxBaiox7pGa4",
    authDomain: "calendar-68bbe.firebaseapp.com",
    databaseURL: "https://calendar-68bbe.firebaseio.com",
    storageBucket: "calendar-68bbe.appspot.com",
    messagingSenderId: "490739243239"
};

const myFirebaseAuthConfig = {
    provider: AuthProviders.Anonymous,
    method: AuthMethods.Anonymous
};


@NgModule({
    declarations: [
        AppComponent,
        DayViewComponent,
        WeekViewComponent,
        MonthViewComponent,
        DayDetailComponent,
        TopbarComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        MaterialModule,
        AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
