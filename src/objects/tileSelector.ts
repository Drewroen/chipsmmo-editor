import { TileSelectorGraphic } from './tileSelector.graphic';

export declare var PIXI: any;

export class TileSelector {

  public terrainSelector: TileSelectorGraphic;
  public itemSelector: TileSelectorGraphic;
  public mobSelector: TileSelectorGraphic;
  public spawnSelector: TileSelectorGraphic;

  private TERRAIN_START_X = 0;
  private ITEMS_START_X = 12;
  private MOBS_START_X = 7;
  private SPAWNINGS_START_X = 15;

  public existingTerrain = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
  ];

  public existingItems = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  public existingMobs = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  ];

  public existingSpawnings = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]

  private mouseDownCoordinates: number[];
  public selectedValue = -1;

  constructor() {
    this.terrainSelector = new TileSelectorGraphic(this.existingTerrain, this.TERRAIN_START_X);
    this.itemSelector = new TileSelectorGraphic(this.existingItems, this.ITEMS_START_X);
    this.mobSelector = new TileSelectorGraphic(this.existingMobs, this.MOBS_START_X);
    this.spawnSelector = new TileSelectorGraphic(this.existingSpawnings, this.SPAWNINGS_START_X);

    this.addMouseListenersToTileSelectorGraphic(this.terrainSelector);
    this.addMouseListenersToTileSelectorGraphic(this.itemSelector);
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

  public goToTerrainSection = () => { this.resetAllGraphics(); this.resetAllSelections(); this.addToTilePickerSection(this.terrainSelector.tileSelectorGraphic.view); };
  public goToMobSection = () => { this.resetAllGraphics(); this.resetAllSelections(); this.addToTilePickerSection(this.mobSelector.tileSelectorGraphic.view); };
  public goToItemSection = () => { this.resetAllGraphics(); this.resetAllSelections(); this.addToTilePickerSection(this.itemSelector.tileSelectorGraphic.view); };
  public goToSpawnSection = () => { this.resetAllGraphics(); this.resetAllSelections(); this.addToTilePickerSection(this.spawnSelector.tileSelectorGraphic.view); };
  public goToSettingsSection = () => { this.resetAllGraphics(); this.resetAllSelections(); };

  private setSelectedTile(): void {
    this.selectedValue = Math.max(this.terrainSelector.getSelectedTileValue(), this.itemSelector.getSelectedTileValue(), this.mobSelector.getSelectedTileValue(), this.spawnSelector.getSelectedTileValue());
  }


  private resetAllGraphics(): void {
    this.terrainSelector.tileSelectorGraphic.view.remove();
    this.itemSelector.tileSelectorGraphic.view.remove();
    this.mobSelector.tileSelectorGraphic.view.remove();
    this.spawnSelector.tileSelectorGraphic.view.remove();
  }

  private resetAllSelections(): void {
    this.terrainSelector.resetSelections();
    this.itemSelector.resetSelections();
    this.mobSelector.resetSelections();
    this.spawnSelector.resetSelections();
  }

  private addToTilePickerSection(graphicToAdd: any)
  {
    document.getElementById('tile-picker-section').appendChild(graphicToAdd);
  }
}
