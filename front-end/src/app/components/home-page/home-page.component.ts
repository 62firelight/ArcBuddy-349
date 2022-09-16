import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { Profile } from 'src/app/Profile';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  animations: [
    trigger('move', [
      state('in', style({ transform: '*' })),
      state('out', style({ transform: 'rotate(360deg)' })),
      transition('in => out', animate('1s')),
      transition('out => in', animate('0s'))
    ]),
  ]
})
export class HomePageComponent implements OnInit {

  title = "Arc Buddy";

  changingStats = new Subject<Profile>();

  addingProfiles = new Subject<Profile>();

  changingProfiles = new Subject<Profile>();

  state = 'in';
  mouseover = false;

  @ViewChild('sidenav')
  sidenav!: MatSidenav;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
  }

  // source: https://stackoverflow.com/questions/44535108/how-do-i-perform-infinite-animations-in-angular-2 
  startAnimation() {
    this.mouseover = true;
    this.state = 'out';
  }

  stopAnimation() {
    this.mouseover = false;
    this.state = 'in';
  }

  onEnd(event: { toState: string; }) {
    if (!this.mouseover) {
      return;
    }

    this.state = 'in';
    if (event.toState === 'in') {
      setTimeout(() => {
        this.state = 'out';
      }, 0);
    }
  }

}
