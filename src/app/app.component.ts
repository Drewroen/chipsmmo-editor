import { Component, HostListener, OnInit } from '@angular/core';
import { GameMap } from 'src/objects/gameMap';
import { TileSelectorState } from '../objects/tileSelector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public TileSelectorState = TileSelectorState;
  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }
  public gameMap: GameMap;
  title = 'chipsmmo-map-editor';

  async ngOnInit() {
    this.gameMap = new GameMap();
    document.getElementById('map').appendChild(this.gameMap.gameMapGraphic.view);
  }
}
