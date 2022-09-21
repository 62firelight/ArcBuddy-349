import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { Profile } from 'src/app/Profile';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
  animations: [
    trigger(
      'inOutAnimation', 
      [
        // fade in
        transition(
          ':enter', 
          [
            style({ height: 0, opacity: 0 }),
            animate('0.25s ease-out', 
                    style({ }))
          ]
        ),
        // fade out
        transition(
          ':leave', 
          [
            style({ }),
            animate('0.25s ease-in', 
                    style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class SearchPageComponent implements OnInit {

  changingStats = new Subject<Profile>();

  addingProfiles  = new Subject<Profile>();

  changingProfiles = new Subject<Profile>();

  constructor(private profileService: ProfileService, private route: Router) { }

  ngOnInit(): void {
    this.changingStats.subscribe((profile) => {
      this.route.navigate([`${profile.membershipType}/${profile.membershipId}`]);
    });
  }

}
