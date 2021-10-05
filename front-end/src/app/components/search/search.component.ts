import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/Profile';
import { ProfileService } from 'src/app/services/profile.service'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  name!: string;
  error!: string;

  profile!: Profile | undefined;

  statsVisibility = true;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.name == undefined) {
      this.error = `Error occurred when parsing Bungie Name. A Bungie Name should formatted similarly to "name#1234".`;
      this.profile = undefined;
      return;
    }

    var nameId = this.name.split("#", 2);

    if (nameId == undefined || nameId.length != 2) {
      this.error = `Error occurred when parsing Bungie Name. A Bungie Name should formatted similarly to "name#1234".`;
      this.profile = undefined;
      return;
    }

    var name = nameId[0];
    var id = nameId[1];

    // console.log("Bungie name: " + name + "#" + id);

    this.profileService.getName(name, id).subscribe((result) => {
      console.log(result);
      this.error = ``;
      this.profile = result;
      this.profile.iconPath = `https://www.bungie.net${this.profile.iconPath}`;
    }, (error) => {
      this.error = `Couldn't find requested Bungie Name. Are you sure that ${this.name} is a registered Bungie.net user?`;
      this.profile = undefined;
    });
  }

  toggleStats() {
    this.statsVisibility = !this.statsVisibility;
  }

}
