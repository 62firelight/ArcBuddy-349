import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/Profile';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-saved-stats',
  templateUrl: './saved-stats.component.html',
  styleUrls: ['./saved-stats.component.css']
})
export class SavedStatsComponent implements OnInit {

  profiles!: Profile[];

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.profileService.getProfiles().subscribe((profiles) => {
      this.profiles = profiles;

      // take ".json" out of the key
      this.profiles.forEach(function (profile) {
        profile.Key = profile.Key?.slice(0, -5);
      });
      
      console.log(profiles);
    });
  }

}
