import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { Profile } from 'src/app/Profile';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  changingStats = new Subject<Profile>();

  addingProfiles  = new Subject<Profile>();

  changingProfiles = new Subject<Profile>();

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
  }

}
