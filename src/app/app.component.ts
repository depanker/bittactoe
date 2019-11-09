import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bidtacktoe';
  constructor(public afAuth: AngularFireAuth) {
    console.log(afAuth);
  }
}
