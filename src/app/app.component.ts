import { Component, HostListener, OnInit } from '@angular/core';
import { GameMap } from 'src/objects/gameMap';
import { MapSettings } from '../objects/mapSettings';
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
  public mapSettings: MapSettings;

  async ngOnInit() {
    this.gameMap = new GameMap();
    this.mapSettings = new MapSettings();
    document.getElementById('map').appendChild(this.gameMap.gameMapGraphic.view);
  }
}
