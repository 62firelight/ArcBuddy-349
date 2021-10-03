import { Component } from '@angular/core';
import { NameService } from './services/name.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Arc Buddy';

  name!: string;
  error!: string;

  constructor(private nameService: NameService) { }

  onSubmit(): void {
    var nameId = this.name.split("#", 2);

    if (nameId.length != 2) {
      this.error = `Error occurred when parsing Bungie Name. A Bungie Name should formatted similarly to "name#1234".`;
      return;
    }

    var name = nameId[0];
    var id = nameId[1];

    // console.log("Bungie name: " + name + "#" + id);

    this.nameService.getName(name, id).subscribe((result) => {
      console.log(result);
      this.error = ``;
    }, (error) => {
      this.error = `Couldn't find requested Bungie Name. Are you sure that ${this.name} is a registered Bungie.net user?`;
    });
  }
}
