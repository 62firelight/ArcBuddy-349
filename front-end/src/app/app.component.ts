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

  constructor(private nameService: NameService) { }

  onSubmit(): void {
    var nameId = this.name.split("#", 2);

    if (nameId.length != 2) {
      console.log("Error occurred when parsing Bungie Name");
      return;
    }

    var name = nameId[0];
    var id = nameId[1];

    // console.log("Bungie name: " + name + "#" + id);

    this.nameService.getName(name, id).subscribe((result) => {
      console.log(result);
    });
  }
}
