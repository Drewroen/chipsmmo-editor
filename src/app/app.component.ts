import { Component, HostListener, OnInit } from '@angular/core';
import { GameMap } from 'src/objects/gameMap';
import { MapExport } from '../objects/mapExport';
import { MapSetting } from '../objects/mapSetting';
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

  async ngOnInit() {
    this.gameMap = new GameMap(24, 24);
    document.getElementById('map').appendChild(this.gameMap.gameMapGraphic.view);
  }

  public downloadLevel()
  {
    let a = document.createElement("a");
    a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(JSON.stringify(this.gameMap.generateExportFile())));
    a.setAttribute('download', "ChipsMMO-Level");
    a.click();
  }

  public uploadLevel(event)
  {
    var file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = () => {
      var map = JSON.parse(fileReader.result as string) as MapExport;
      this.gameMap.regenerateMap(map.settings, map.terrain, map.mobs, map.spawns);
    }
    fileReader.readAsText(file);
  }
}
