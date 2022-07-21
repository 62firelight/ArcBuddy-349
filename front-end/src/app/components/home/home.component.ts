import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { Profile } from 'src/app/Profile';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title = "Arc Buddy";

  changingStats = new Subject<Profile>();

  addingProfiles  = new Subject<Profile>();

  changingProfiles = new Subject<Profile>();

  @ViewChild('sidenav')
  sidenav!: MatSidenav;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
  }

}
