import { TileSelector } from './tileSelector';

export declare var PIXI: any;

export class GameMap {
  public tileSelector: TileSelector;

  private terrain: any[][];
  private terrainInformation: number[][];
  private items: any[][];
  private itemInformation: number[][];
  private mobs: any[][];
  private mobInformation: number[][];

  private leftClickDown = false;
  private rightClickDown = false;

  public height = 24;
  public width = 24;

  public gameMapGraphic: any;

  constructor()
  {
    this.tileSelector = new TileSelector();

    this.gameMapGraphic = new PIXI.Application(
      this.width * 32, this.height * 32,
      { transparent: true }
    );

    this.terrain = [];
    this.terrainInformation = [];
    this.items = [];
    this.itemInformation = [];
    this.mobs = [];
    this.mobInformation = [];

    for(var i = 0; i < this.width; i++)
    {
      this.terrain[i] = [];
      this.terrainInformation[i] = [];
      this.items[i] = [];
      this.itemInformation[i] = [];
      this.mobs[i] = [];
      this.mobInformation[i] = [];
      for(var j = 0; j < this.height; j++)
      {
        this.terrainInformation[i][j] = 0;
        this.itemInformation[i][j] = 0;

        this.terrain[i][j] = new PIXI.Sprite();
        this.items[i][j] = new PIXI.Sprite();
        this.mobs[i][j] = new PIXI.Sprite();

        this.terrain[i][j].texture = this.generateTileTexture(0);
        this.items[i][j].texture = null;
        this.mobs[i][j].texture = null;

        this.terrain[i][j].x = 32 * i;
        this.terrain[i][j].y = 32 * j;
        this.items[i][j].x = 32 * i;
        this.items[i][j].y = 32 * j;
        this.mobs[i][j].x = 32 * i;
        this.mobs[i][j].y = 32 * j;

        this.terrain[i][j].interactive = true;
        this.terrain[i][j].on('mousedown', (event) => {
          this.leftClickDown = true;
        });

        this.terrain[i][j].on('rightdown', (event) => {
          this.rightClickDown = true;
        })

        this.terrain[i][j].on('mousemove', (event) => {
          if(this.leftClickDown)
            this.updateTile(Math.floor(event.data.global.x / 32), Math.floor(event.data.global.y / 32), this.tileSelector.selectedValue);
          else if(this.rightClickDown)
            this.resetTile(Math.floor(event.data.global.x / 32), Math.floor(event.data.global.y / 32));
        });

        this.terrain[i][j].on('mouseup', (event) => {
          if(this.leftClickDown)
            this.updateTile(Math.floor(event.data.global.x / 32), Math.floor(event.data.global.y / 32), this.tileSelector.selectedValue);
          this.leftClickDown = false;
        });

        this.terrain[i][j].on('rightup', (event) => {
          if(this.rightClickDown)
            this.resetTile(Math.floor(event.data.global.x / 32), Math.floor(event.data.global.y / 32));
          this.rightClickDown = false;
        });

        this.gameMapGraphic.stage.addChild(this.terrain[i][j]);
        this.gameMapGraphic.stage.addChild(this.items[i][j]);
        this.gameMapGraphic.stage.addChild(this.mobs[i][j]);
      }
    }
  }

  private generateTileTexture(x: number)
  {
    let base = new PIXI.Texture.from('./../assets/TILESET.png');
    let texture = new PIXI.Texture(base.baseTexture, new PIXI.Rectangle(32 * (x % 12), 32 * ((x - (x % 12)) / 12), 32, 32));
    return texture;
  }

  public updateTile(x: number, y: number, tileValue: number)
  {
    try {
      if(tileValue < 84)
      {
        this.terrain[x][y].texture = this.generateTileTexture(tileValue);
        this.terrainInformation[x][y] = tileValue;
      }
      else if (tileValue < 144)
      {
        this.mobs[x][y].texture = this.generateTileTexture(tileValue);
        this.mobInformation[x][y] = tileValue;
      }
      else
      {
        this.items[x][y].texture = this.generateTileTexture(tileValue);
        this.itemInformation[x][y] = tileValue;
      }
    } catch {
      this.leftClickDown = false;
      this.rightClickDown = false;
    }
  }

  public resetTile(x: number, y: number)
  {
    try {
      this.terrain[x][y].texture = this.generateTileTexture(0);
      this.mobs[x][y].texture = null;
      this.items[x][y].texture = null;
    } catch {
      this.leftClickDown = false;
      this.rightClickDown = false;
    }

  }

  public resize(height: number, width: number)
  {
    this.height = height;
    this.width = width;

    this.gameMapGraphic.renderer.resize(height, width);
  }
}
