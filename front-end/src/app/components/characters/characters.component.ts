import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Character } from 'src/app/Character';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit {
  @Input()
  characters!: Character[];

  @Output()
  newCharacterIdEvent = new EventEmitter<string>(); 

  constructor() { }

  ngOnInit(): void {
  }

  displayCharacter(characterId: string) {
    this.newCharacterIdEvent.emit(characterId);
  }

}
