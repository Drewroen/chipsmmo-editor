import { Component, HostListener, OnInit } from '@angular/core';
import { GameMap } from 'src/objects/gameMap';

export declare var PIXI: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }
  public gameMap: GameMap;
  title = 'chipsmmo-map-editor';

  async ngOnInit() {
    this.gameMap = new GameMap();
    document.getElementById('map').appendChild(this.gameMap.gameMapGraphic.view);

    document.getElementById('tile-picker').appendChild(this.gameMap.tileSelector.tileSelectorGraphic.view)
  }
}
