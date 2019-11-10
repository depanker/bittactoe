import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bidtacktoe';
  constructor(public afAuth: AngularFireAuth, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    angulartics2GoogleAnalytics.startTracking();
    console.log(afAuth);
  }
}
