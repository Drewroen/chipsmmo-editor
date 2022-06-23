import { Component, HostListener, OnInit } from '@angular/core';
import { GameMap } from 'src/objects/gameMap';
import { MapExport } from '../objects/mapExport';
import { TileSelectorState } from '../objects/tileSelector';
import { MouseService } from '../services/mouseService';

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
  public mouseService: MouseService;

  async ngOnInit() {
    this.mouseService = new MouseService();
    this.gameMap = new GameMap(24, 24, this.mouseService);
    document.getElementById('map').appendChild(this.gameMap.gameMapGraphic.view);
  }

  public downloadLevel()
  {
    var mapExport = this.gameMap.generateExportFile().toString();
    let a = document.createElement("a");
    var file = new Blob([mapExport], { type: 'text/plain' });
    a.href = URL.createObjectURL(file);
    a.download = 'ChipsMMO-Level';
    a.click();
  }

  public uploadLevel(event) {
    var file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = () => {
      try {
        var map = JSON.parse(fileReader.result as string) as MapExport;
        this.gameMap.regenerateMap(map.settings, map.gameMap);
      }
      catch
      {
        console.log("Not a valid level!");
      }
    }
    fileReader.readAsText(file);
  }
}
