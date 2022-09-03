import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Character } from 'src/app/Character';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css'],
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
            animate('0.05s ease-in', 
                    style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class CharactersComponent implements OnInit {
  @Input()
  characters!: Character[];

  @Input()
  currentId!: string;

  @Output()
  newCharacterIdEvent = new EventEmitter<string>(); 

  constructor() { }

  ngOnInit(): void {
  }

  displayCharacter(characterId: string) {
    this.newCharacterIdEvent.emit(characterId);
  }

}
