export declare var PIXI: any;

export class TileSelectorGraphic {
  public tiles: any[][];

  public tileSelectorGraphic: any;

  public existingItemsMap: number[][];

  public tilemapYOffset: number;

  private NUMBER_OF_COLUMNS_IN_TILESET = 12;

  constructor(existingItemsMap: number[][], tilemapYOffset: number)
  {
    this.tilemapYOffset = tilemapYOffset;
    this.existingItemsMap = existingItemsMap;
    this.tileSelectorGraphic = new PIXI.Application(
      this.existingItemsMap[0].length * 32, this.existingItemsMap.length * 32,
      { transparent: true }
    );

    this.tiles = [];
    for(var i = 0; i < this.existingItemsMap.length; i++)
    {
      this.tiles[i] = [];
      for(var j = 0; j < this.existingItemsMap[i].length; j++)
      {
        const valueToUse = this.existingItemsMap[i][j] == 1 ? ((i + this.tilemapYOffset) * this.NUMBER_OF_COLUMNS_IN_TILESET) + j : -1;
        this.tiles[i][j] = new PIXI.Sprite();
        if(valueToUse >= 0)
        {
          this.tiles[i][j].texture = this.generateTileTexture(valueToUse);
          this.tiles[i][j].y = 32 * i;
          this.tiles[i][j].x = 32 * j;
          this.tileSelectorGraphic.stage.addChild(this.tiles[i][j]);
        }
      }
    }
  }

  public resetSelections()
  {
    this.clearAlphas();
  }

  private generateTileTexture(x: number)
  {
    let base = new PIXI.Texture.from('./../assets/TILESELECTION.png');
    let texture = new PIXI.Texture(base.baseTexture, new PIXI.Rectangle(32 * (x % this.NUMBER_OF_COLUMNS_IN_TILESET), 32 * ((x - (x % this.NUMBER_OF_COLUMNS_IN_TILESET)) / this.NUMBER_OF_COLUMNS_IN_TILESET), 32, 32));
    return texture;
  }

  private clearAlphas(): void {
    this.tiles.forEach(tileRow => {
      tileRow.forEach(tile => {
        tile.alpha = 1;
      });
    });
  }

  public getSelectedTileValue(): number {
    for(var i = 0; i < this.tiles.length; i++)
      for(var j = 0; j < this.tiles[i].length; j++)
        if (this.tiles[i][j].alpha == 0.5)
          return ((i + this.tilemapYOffset) * this.NUMBER_OF_COLUMNS_IN_TILESET) + j;
    return -1;
  }
}
