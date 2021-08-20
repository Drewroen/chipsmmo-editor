export declare var PIXI: any;

export class TileSelector {
  private tile: any[][];
  private tileInformation: number[][];
  private mouseDownCoordinates: number[];

  public tileSelectorGraphic: any;

  public selectedValue: number = 0;

  public existingItemsMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  constructor()
  {
    this.tileSelectorGraphic = new PIXI.Application(
      12 * 32, 16 * 32,
      { transparent: true }
    );

    this.tile = [];
    this.tileInformation = [];
    for(var i = 0; i < this.existingItemsMap.length; i++)
    {
      this.tile[i] = [];
      this.tileInformation[i] = [];
      for(var j = 0; j < this.existingItemsMap[i].length; j++)
      {
        const valueToUse = this.existingItemsMap[i][j] == 1 ? (i * 12) + j : 0
        this.tileInformation[i][j] = valueToUse;
        this.tile[i][j] = new PIXI.Sprite();
        this.tile[i][j].interactive = true;
        this.tile[i][j].on('mousedown', (event) => {
          this.mouseDownCoordinates = [event.data.originalEvent.clientX, event.data.originalEvent.clientY];
        });
        this.tile[i][j].on('click', (event) => {
          const oldX = this.mouseDownCoordinates[0];
          const oldY = this.mouseDownCoordinates[1];
          const newX = event.data.originalEvent.clientX;
          const newY = event.data.originalEvent.clientY;
          if (Math.abs(oldX - newX) < 10 && Math.abs(oldY - newY) < 10)
          {
            this.clearAlphas();
            event.currentTarget.alpha = .5;
            this.setSelectedValue();
          }

        });
        this.tile[i][j].texture = (this.generateTileTexture(valueToUse));
        this.tile[i][j].y = 32 * i;
        this.tile[i][j].x = 32 * j;
        this.tileSelectorGraphic.stage.addChild(this.tile[i][j]);
      }
    }

    this.tile[0][0].alpha = 0.5;
  }

  private generateTileTexture(x: number)
  {
    let base = new PIXI.Texture.from('./../assets/TILESELECTION.png');
    let texture = new PIXI.Texture(base.baseTexture, new PIXI.Rectangle(32 * (x % 12), 32 * ((x - (x % 12)) / 12), 32, 32));
    return texture;
  }

  private clearAlphas(): void {
    this.tile.forEach(tileRow => {
      tileRow.forEach(tile => {
        tile.alpha = 1;
      });
    });
  }

  private setSelectedValue(): void {
    for(var i = 0; i < this.tile.length; i++)
      for(var j = 0; j < this.tile[i].length; j++)
        if (this.tile[i][j].alpha == 0.5)
          this.selectedValue = this.existingItemsMap[i][j] == 1 ? (i * 12) + j : 0;
  }
}
