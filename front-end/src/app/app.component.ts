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

    console.log(nameId);

    // this.nameService.subscribe(this.name)
  }
}
