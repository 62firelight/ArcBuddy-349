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
    // this.profileService.getStats(this.profile.membershipType, this.profile.membershipId)
    // .subscribe((result) => {
    //   this.profile.characterStats = result;
    //   console.log(this.profile.characterStats);
    // })

    this.profile = {
      displayName: "62firelight#8173",
      iconPath: "",
      membershipId: "222",
      membershipType: "3",
      characterStats: {}
    };

    this.profile.characterStats = {
      "Activities Cleared": '1711', 
      "Activities Entered": '3761', 
      "Assists": '49808'
    }
  }

}
