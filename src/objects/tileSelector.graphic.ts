import * as PIXI from 'pixi.js';

export class TileSelectorGraphic {
  public tiles: any[][];

  public tileSelectorGraphic: any;

  public existingItemsCount: number;

  public type: string;

  private NUMBER_OF_COLUMNS_IN_TILESET = 12;

  constructor(existingItemsCount: number, type: string)
  {
    this.type = type;
    this.existingItemsCount = existingItemsCount;
    this.tileSelectorGraphic = new PIXI.Application(
      {
        transparent: true,
        width: this.NUMBER_OF_COLUMNS_IN_TILESET * 32,
        height: Math.ceil(existingItemsCount / this.NUMBER_OF_COLUMNS_IN_TILESET) * 32
      }
    );

    this.tiles = [];
    for(var i = 0; i < Math.ceil(this.existingItemsCount / this.NUMBER_OF_COLUMNS_IN_TILESET); i++)
    {
      this.tiles[i] = [];
      for(var j = 0; j < 12; j++)
      {
        const valueToUse = (i * this.NUMBER_OF_COLUMNS_IN_TILESET) + j;
        this.tiles[i][j] = new PIXI.Sprite();
        if(valueToUse < existingItemsCount)
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
    this.tiles.forEach(tileRow => {
      tileRow.forEach(tile => {
        tile.alpha = 1;
      });
    });
  }

  private generateTileTexture(x: number)
  {
    let base = PIXI.Texture.from('./../assets/TILE_SELECTION_' + this.type + '.png');
    let texture = new PIXI.Texture(base.baseTexture, new PIXI.Rectangle(32 * (x % this.NUMBER_OF_COLUMNS_IN_TILESET), 32 * ((x - (x % this.NUMBER_OF_COLUMNS_IN_TILESET)) / this.NUMBER_OF_COLUMNS_IN_TILESET), 32, 32));
    return texture;
  }

  public getSelectedTileValue(): number {
    for(var i = 0; i < this.tiles.length; i++)
      for(var j = 0; j < this.tiles[i].length; j++)
        if (this.tiles[i][j].alpha == 0.5)
          return (i * this.NUMBER_OF_COLUMNS_IN_TILESET) + j;
    return -1;
  }
}
