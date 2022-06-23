import { MouseService } from '../services/mouseService';
import { TileSelectorGraphic } from './tileSelector.graphic';

export enum TileSelectorState {
  Terrain, Mobs, Spawning, Settings, ImportExport
};

export class TileSelector {
  public mouseService: MouseService;

  public terrainSelector: TileSelectorGraphic;
  public mobSelector: TileSelectorGraphic;
  public spawnSelector: TileSelectorGraphic;

  public existingTerrainCount = 50;

  public existingMobCount = 40;

  public existingSpawnings = 2;

  private mouseDownCoordinates: number[];
  public selectedValue = -1;

  public state: TileSelectorState;

  constructor(mouseService: MouseService) {
    this.mouseService = mouseService;

    this.terrainSelector = new TileSelectorGraphic(this.existingTerrainCount, "TERRAIN");
    this.mobSelector = new TileSelectorGraphic(this.existingMobCount, "MOB");
    this.spawnSelector = new TileSelectorGraphic(this.existingSpawnings, "SPAWN");

    this.addMouseListenersToTileSelectorGraphic(this.terrainSelector);
    this.addMouseListenersToTileSelectorGraphic(this.mobSelector);
    this.addMouseListenersToTileSelectorGraphic(this.spawnSelector);

    this.goToTerrainSection();
  }

  private addMouseListenersToTileSelectorGraphic(tileSelectorGraphic: TileSelectorGraphic): void {
    tileSelectorGraphic.tiles.forEach(tileRow => {
      tileRow.forEach(tileGraphic => {
        tileGraphic.interactive = true;
        tileGraphic.on('mousedown', (event) => {
          this.handleMouseDown(event);
        });
        tileGraphic.on('click', (event) => {
          this.handleClick(event);
        });
      });
    });
  }

  private handleMouseDown(event: any): void {
    this.mouseDownCoordinates = [event.data.originalEvent.clientX, event.data.originalEvent.clientY];
  }

  private handleClick(event: any): void {
    const oldX = this.mouseDownCoordinates[0];
    const oldY = this.mouseDownCoordinates[1];
    const newX = event.data.originalEvent.clientX;
    const newY = event.data.originalEvent.clientY;
    if (Math.abs(oldX - newX) < 10 && Math.abs(oldY - newY) < 10)
    {
      this.resetAllSelections();
      event.currentTarget.alpha = .5;
      this.setSelectedTile();
    }
  }

  public goToTerrainSection = () => {
    this.resetAllGraphics();
    this.resetAllSelections();
    this.state = TileSelectorState.Terrain;
    this.addToTilePickerSection(this.terrainSelector.tileSelectorGraphic.view);
  };

  public goToMobSection = () => {
    this.resetAllGraphics();
    this.resetAllSelections();
    this.state = TileSelectorState.Mobs;
    this.addToTilePickerSection(this.mobSelector.tileSelectorGraphic.view);
  };

  public goToSpawnSection = () => {
    this.resetAllGraphics();
    this.resetAllSelections();
    this.state = TileSelectorState.Spawning;
    this.addToTilePickerSection(this.spawnSelector.tileSelectorGraphic.view);
  };

  public goToSettingsSection = () => {
    this.resetAllGraphics();
    this.resetAllSelections();
    this.state = TileSelectorState.Settings;
  };

  public goToImportExportSection = () => {
    this.resetAllGraphics();
    this.resetAllSelections();
    this.state = TileSelectorState.ImportExport;
  }

  private setSelectedTile(): void {
    this.selectedValue = Math.max(this.terrainSelector.getSelectedTileValue(), this.mobSelector.getSelectedTileValue(), this.spawnSelector.getSelectedTileValue());
  }


  private resetAllGraphics(): void {
    this.terrainSelector.tileSelectorGraphic.view.remove();
    this.mobSelector.tileSelectorGraphic.view.remove();
    this.spawnSelector.tileSelectorGraphic.view.remove();
  }

  private resetAllSelections(): void {
    this.terrainSelector.resetSelections();
    this.mobSelector.resetSelections();
    this.spawnSelector.resetSelections();
  }

  private addToTilePickerSection(graphicToAdd: any)
  {
    document.getElementById('tile-picker-section').appendChild(graphicToAdd);
  }
}
