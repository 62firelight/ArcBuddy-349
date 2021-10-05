import { Component, Input, OnInit } from '@angular/core';
import { Profile } from 'src/app/Profile';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  @Input() profile!: Profile;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.profileService.getStats(this.profile.membershipType, this.profile.membershipId)
    .subscribe((result) => {
      this.profile.characterStats = result;
      console.log(this.profile.characterStats);
    })
  }

}
