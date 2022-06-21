import { TileSelector } from './tileSelector';
import * as PIXI from 'pixi.js';
import { ThisReceiver } from '@angular/compiler';
import { MapSetting } from './mapSetting';
import { MapExport } from './mapExport';

export class GameMap {
  public tileSelector: TileSelector;

  private terrain: any[][];
  private terrainInformation: number[][];
  private mobs: any[][];
  private mobInformation: number[][];
  private spawnings: any[][];
  private spawningInformation: number[][];

  private leftClickDown = false;
  private rightClickDown = false;

  public height: number;
  public width: number;

  public gameMapGraphic: PIXI.Application;

  public mapSettings: Array<MapSetting>;

  constructor(width: number, height: number)
  {
    this.width = width;
    this.height = height;

    this.mapSettings = [
      new MapSetting("Red Key", 10),
      new MapSetting("Yellow Key", 10),
      new MapSetting("Blue Key", 10),
      new MapSetting("Green Key", 4),
      new MapSetting("Flippers", 4),
      new MapSetting("Fire Boots", 4),
      new MapSetting("Ice Skates", 4),
      new MapSetting("Force Boots", 4),
      new MapSetting("Bomb", 20),
      new MapSetting("Chip", 50),
      new MapSetting("Bowling Ball", 10),
      new MapSetting("Whistle", 15),
      new MapSetting("Toggle Chip", 20),
      new MapSetting("Golden Chip", 4),
      new MapSetting("Treasure Chest", 1),
    ];

    this.tileSelector = new TileSelector();

    this.gameMapGraphic = new PIXI.Application(
      {
        transparent: true,
        height: this.height * 32,
        width: this.width * 32
      }
    );

    this.terrain = [];
    this.terrainInformation = [];
    this.mobs = [];
    this.mobInformation = [];
    this.spawnings = [];
    this.spawningInformation = [];

    for(var i = 0; i < this.width; i++)
    {
      this.terrain[i] = [];
      this.terrainInformation[i] = [];
      this.mobs[i] = [];
      this.mobInformation[i] = [];
      this.spawnings[i] = []
      this.spawningInformation[i] = [];
      for(var j = 0; j < this.height; j++)
      {
        this.terrainInformation[i][j] = 0;
        this.mobInformation[i][j] = 0;
        this.spawningInformation[i][j] = 0;

        this.terrain[i][j] = new PIXI.Sprite();
        this.mobs[i][j] = new PIXI.Sprite();
        this.spawnings[i][j] = new PIXI.Sprite();
        this.spawnings[i][j].alpha = 0.3;

        this.terrain[i][j].texture = this.generateTileTexture(0);
        this.mobs[i][j].texture = null;
        this.spawnings[i][j].texture = null;

        this.terrain[i][j].x = 32 * i;
        this.terrain[i][j].y = 32 * j;
        this.mobs[i][j].x = 32 * i;
        this.mobs[i][j].y = 32 * j;
        this.spawnings[i][j].x = 32 * i;
        this.spawnings[i][j].y = 32 * j;

        this.terrain[i][j].interactive = true;
        this.terrain[i][j].on('mousedown', () => {
          this.leftClickDown = true;
        });

        this.terrain[i][j].on('rightdown', () => {
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
        this.gameMapGraphic.stage.addChild(this.mobs[i][j]);
        this.gameMapGraphic.stage.addChild(this.spawnings[i][j]);
      }
    }
  }

  public regenerateMap(mapSettings: Array<MapSetting>, importedTerrain: any[][], importedMobs: any[][], importedSpawnings: any[][])
  {
    this.width = importedTerrain.length;
    this.height = importedTerrain[0].length;

    for (var i = this.gameMapGraphic.stage.children.length - 1; i >= 0; i--) {
      this.gameMapGraphic.stage.removeChild(this.gameMapGraphic.stage.children[i]);
    };

    this.resize();

    this.mapSettings = mapSettings;

    var requiredSettings = ["Red Key", "Yellow Key", "Blue Key", "Green Key", "Flippers", "Fire Boots", "Ice Skates", "Force Boots", "Bomb", "Chip", "Bowling Ball", "Whistle", "Toggle Chip", "Golden Chip", "Treasure Chest"];

    for(var setting of requiredSettings)
    {
      if (this.getMapSettingByName(setting) == null)
        this.mapSettings.push(new MapSetting(setting, 0));
    }

    this.terrain = [];
    this.terrainInformation = [];
    this.mobs = [];
    this.mobInformation = [];
    this.spawnings = [];
    this.spawningInformation = [];

    for(var i = 0; i < this.width; i++)
    {
      this.terrain[i] = [];
      this.terrainInformation[i] = [];
      this.mobs[i] = [];
      this.mobInformation[i] = [];
      this.spawnings[i] = []
      this.spawningInformation[i] = [];
      for(var j = 0; j < this.height; j++)
      {
        this.terrainInformation[i][j] = importedTerrain[i][j];
        this.mobInformation[i][j] = 0;
        this.spawningInformation[i][j] = 0;

        this.terrain[i][j] = new PIXI.Sprite();
        this.mobs[i][j] = new PIXI.Sprite();
        this.spawnings[i][j] = new PIXI.Sprite();
        this.spawnings[i][j].alpha = 0.3;

        this.terrain[i][j].texture = this.generateTileTexture(importedTerrain[i][j]);
        this.mobs[i][j].texture = importedMobs[i][j] != 0 ? this.generateTileTexture(importedMobs[i][j]) : null;
        this.spawnings[i][j].texture = importedSpawnings[i][j] != 0 ? this.generateTileTexture(importedSpawnings[i][j]) : null;

        this.terrain[i][j].x = 32 * i;
        this.terrain[i][j].y = 32 * j;
        this.mobs[i][j].x = 32 * i;
        this.mobs[i][j].y = 32 * j;
        this.spawnings[i][j].x = 32 * i;
        this.spawnings[i][j].y = 32 * j;

        this.terrain[i][j].interactive = true;
        this.terrain[i][j].on('mousedown', () => {
          this.leftClickDown = true;
        });

        this.terrain[i][j].on('rightdown', () => {
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
        this.gameMapGraphic.stage.addChild(this.mobs[i][j]);
        this.gameMapGraphic.stage.addChild(this.spawnings[i][j]);
      }
    }
  }

  private generateTileTexture(x: number)
  {
    let base = PIXI.Texture.from('./../assets/TILESET.png');
    let texture = new PIXI.Texture(base.baseTexture, new PIXI.Rectangle(32 * (x % 12), 32 * ((x - (x % 12)) / 12), 32, 32));
    return texture;
  }

  public updateTile(x: number, y: number, tileValue: number)
  {
    try {
      if(tileValue >= 0)
      {
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
          this.spawnings[x][y].texture = this.generateTileTexture(tileValue);
          this.spawningInformation[x][y] = tileValue;
        }
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
      this.terrainInformation[x][y] = 0;
      this.mobs[x][y].texture = null;
      this.mobInformation[x][y] = 0;
      this.spawnings[x][y].texture = null;
      this.spawningInformation[x][y] = 0;
    } catch {
      this.leftClickDown = false;
      this.rightClickDown = false;
    }

  }

  private resize()
  {
    this.gameMapGraphic.renderer.resize(this.width * 32, this.height * 32);
  }

  public decrementHeight()
  {
    if (this.height > 9)
    {
      this.height--;
      this.resize();

      for(var i = 0; i < this.terrain.length; i++)
      {
        this.gameMapGraphic.stage.removeChild(this.terrain[i][this.terrain[0].length - 1]);
        this.gameMapGraphic.stage.removeChild(this.mobs[i][this.mobs[0].length - 1]);
        this.gameMapGraphic.stage.removeChild(this.spawnings[i][this.spawnings[0].length - 1]);
      }

      for(var i = 0; i < this.terrainInformation.length; i++)
      {
        this.terrainInformation[i].pop();
        this.mobInformation[i].pop();
        this.spawningInformation[i].pop();

        this.terrain[i].pop();
        this.mobs[i].pop();
        this.spawnings[i].pop();
      }
    }
  }

  public incrementHeight()
  {
    if (this.height < 32)
    {
      this.height++;
      this.resize();

      var j = this.terrain[0].length;
      for(var i = 0; i < this.terrain.length; i++)
      {
        this.terrainInformation[i][j] = 0;
        this.mobInformation[i][j] = 0;
        this.spawningInformation[i][j] = 0;

        this.terrainInformation[i][j] = 0;
        this.mobInformation[i][j] = 0;
        this.spawningInformation[i][j] = 0;

        this.terrain[i][j] = new PIXI.Sprite();
        this.mobs[i][j] = new PIXI.Sprite();
        this.spawnings[i][j] = new PIXI.Sprite();
        this.spawnings[i][j].alpha = 0.3;

        this.terrain[i][j].texture = this.generateTileTexture(0);
        this.mobs[i][j].texture = null;
        this.spawnings[i][j].texture = null;

        this.terrain[i][j].x = 32 * i;
        this.terrain[i][j].y = 32 * j;
        this.mobs[i][j].x = 32 * i;
        this.mobs[i][j].y = 32 * j;
        this.spawnings[i][j].x = 32 * i;
        this.spawnings[i][j].y = 32 * j;

        this.terrain[i][j].interactive = true;
        this.terrain[i][j].on('mousedown', () => {
          this.leftClickDown = true;
        });

        this.terrain[i][j].on('rightdown', () => {
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
        this.gameMapGraphic.stage.addChild(this.mobs[i][j]);
        this.gameMapGraphic.stage.addChild(this.spawnings[i][j]);

        this.resetTile(i, j);
      }
    }
  }

  public decrementWidth()
  {
    if (this.width > 9)
    {
      this.width--;
      this.resize();

      for(var i = 0; i < this.terrain[0].length; i++)
      {
        this.gameMapGraphic.stage.removeChild(this.terrain[this.terrain.length - 1][i]);
        this.gameMapGraphic.stage.removeChild(this.mobs[this.mobs.length - 1][i]);
        this.gameMapGraphic.stage.removeChild(this.spawnings[this.spawnings.length - 1][i]);
      }

      this.terrainInformation.pop();
      this.mobInformation.pop();
      this.spawningInformation.pop();

      this.terrain.pop();
      this.mobs.pop();
      this.spawnings.pop();
    }
  }

  public incrementWidth()
  {
    if (this.width < 32)
    {
      this.width++;
      this.resize();

      var i = this.terrain.length;

      this.terrainInformation.push([]);
      this.mobInformation.push([]);
      this.spawningInformation.push([]);

      this.terrain.push([]);
      this.mobs.push([]);
      this.spawnings.push([]);

      for(var j = 0; j < this.terrain[0].length; j++)
      {
        this.terrainInformation[i][j] = 0;
        this.mobInformation[i][j] = 0;
        this.spawningInformation[i][j] = 0;

        this.terrainInformation[i][j] = 0;
        this.mobInformation[i][j] = 0;
        this.spawningInformation[i][j] = 0;

        this.terrain[i][j] = new PIXI.Sprite();
        this.mobs[i][j] = new PIXI.Sprite();
        this.spawnings[i][j] = new PIXI.Sprite();
        this.spawnings[i][j].alpha = 0.3;

        this.terrain[i][j].texture = this.generateTileTexture(0);
        this.mobs[i][j].texture = null;
        this.spawnings[i][j].texture = null;

        this.terrain[i][j].x = 32 * i;
        this.terrain[i][j].y = 32 * j;
        this.mobs[i][j].x = 32 * i;
        this.mobs[i][j].y = 32 * j;
        this.spawnings[i][j].x = 32 * i;
        this.spawnings[i][j].y = 32 * j;

        this.terrain[i][j].interactive = true;
        this.terrain[i][j].on('mousedown', () => {
          this.leftClickDown = true;
        });

        this.terrain[i][j].on('rightdown', () => {
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
        this.gameMapGraphic.stage.addChild(this.mobs[i][j]);
        this.gameMapGraphic.stage.addChild(this.spawnings[i][j]);

        this.resetTile(i, j);
      }
    }
  }

  public generateExportFile(): MapExport
  {
    return new MapExport(this.terrainInformation, this.mobInformation, this.spawningInformation, this.mapSettings);
  }

  public getMapSettingByName(name: string)
  {
    for(var i = 0; i < this.mapSettings.length; i++)
    {
      if (this.mapSettings[i].name == name)
        return this.mapSettings[i];
    }
    return null;
  }
}
