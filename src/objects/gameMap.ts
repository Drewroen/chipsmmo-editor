import { TileSelector, TileSelectorState } from './tileSelector';
import * as PIXI from 'pixi.js';
import { MapSetting } from './mapSetting';
import { MapExport, TileExport } from './mapExport';
import { MapTile } from './mapTile';
import { MouseService } from '../services/mouseService';

export class GameMap {
  public tileSelector: TileSelector;

  public mouseService: MouseService;

  private map: MapTile[][];

  public height: number;
  public width: number;

  public gameMapGraphic: PIXI.Application;

  public mapSettings: Array<MapSetting>;

  constructor(width: number, height: number, mouseService: MouseService)
  {
    this.mouseService = mouseService;

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

    this.tileSelector = new TileSelector(this.mouseService);

    this.gameMapGraphic = new PIXI.Application(
      {
        transparent: true,
        height: this.height * 32,
        width: this.width * 32
      }
    );

    this.map = [];

    for(var i = 0; i < this.width; i++)
    {
      this.map[i] = [];
      for(var j = 0; j < this.height; j++)
      {
        this.map[i][j] = new MapTile(32 * i, 32 * j);

        this.addMouseListeners(this.map[i][j].terrainSprite);

        this.gameMapGraphic.stage.addChild(this.map[i][j].terrainSprite);
        this.gameMapGraphic.stage.addChild(this.map[i][j].mobSprite);
        this.gameMapGraphic.stage.addChild(this.map[i][j].spawnSprite);
      }
    }
  }

  public regenerateMap(mapSettings: Array<MapSetting>, importedMap: TileExport[][])
  {
    this.width = importedMap.length;
    this.height = importedMap[0].length;

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

    this.map = [];

    for(var i = 0; i < this.width; i++)
    {
      this.map[i] = [];

      for(var j = 0; j < this.height; j++)
      {
        this.map[i][j] = new MapTile(32 * i, 32 * j);
        this.map[i][j].updateTerrain(importedMap[i][j].terrain);
        this.map[i][j].updateMob(importedMap[i][j].mob);
        this.map[i][j].updateSpawn(importedMap[i][j].spawn);

        this.addMouseListeners(this.map[i][j].terrainSprite);

        this.gameMapGraphic.stage.addChild(this.map[i][j].terrainSprite);
        this.gameMapGraphic.stage.addChild(this.map[i][j].mobSprite);
        this.gameMapGraphic.stage.addChild(this.map[i][j].spawnSprite);
      }
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

      for(var i = 0; i < this.map.length; i++)
      {
        this.gameMapGraphic.stage.removeChild(this.map[i][this.map[0].length - 1].terrainSprite);
        this.gameMapGraphic.stage.removeChild(this.map[i][this.map[0].length - 1].mobSprite);
        this.gameMapGraphic.stage.removeChild(this.map[i][this.map[0].length - 1].spawnSprite);
      }

      for(var i = 0; i < this.map.length; i++)
        this.map[i].pop();
    }
  }

  public incrementHeight()
  {
    if (this.height < 32)
    {
      this.height++;
      this.resize();

      var j = this.map[0].length;
      for(var i = 0; i < this.map.length; i++)
      {
        this.map[i][j] = new MapTile(32 * i, 32 * j);

        this.addMouseListeners(this.map[i][j].terrainSprite);

        this.gameMapGraphic.stage.addChild(this.map[i][j].terrainSprite);
        this.gameMapGraphic.stage.addChild(this.map[i][j].mobSprite);
        this.gameMapGraphic.stage.addChild(this.map[i][j].spawnSprite);
      }
    }
  }

  public decrementWidth()
  {
    if (this.width > 9)
    {
      this.width--;
      this.resize();

      for(var i = 0; i < this.map[0].length; i++)
      {
        this.gameMapGraphic.stage.removeChild(this.map[this.map.length - 1][i].terrainSprite);
        this.gameMapGraphic.stage.removeChild(this.map[this.map.length - 1][i].mobSprite);
        this.gameMapGraphic.stage.removeChild(this.map[this.map.length - 1][i].spawnSprite);
      }

      this.map.pop();
    }
  }

  public incrementWidth()
  {
    if (this.width < 32)
    {
      this.width++;
      this.resize();

      var i = this.map.length;

      this.map.push([]);

      for(var j = 0; j < this.map[0].length; j++)
      {
        this.map[i][j] = new MapTile(32 * i, 32 * j);

        this.addMouseListeners(this.map[i][j].terrainSprite);

        this.gameMapGraphic.stage.addChild(this.map[i][j].terrainSprite);
        this.gameMapGraphic.stage.addChild(this.map[i][j].mobSprite);
        this.gameMapGraphic.stage.addChild(this.map[i][j].spawnSprite);
      }
    }
  }

  public generateExportFile(): MapExport
  {
    return new MapExport(this.map, this.mapSettings);
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

  private updateTile(x: number, y: number, value: number)
  {
    if (value < 0)
      return;
    try
    {
      switch(this.tileSelector.state)
      {
        case TileSelectorState.Terrain: this.map[x][y].updateTerrain(value); break;
        case TileSelectorState.Mobs: this.map[x][y].updateMob(value); break;
        case TileSelectorState.Spawning: this.map[x][y].updateSpawn(value); break;
      }
    }
    catch
    {
      this.mouseService.leftClickDown = false;
    }
  }

  private addMouseListeners(sprite: PIXI.Sprite)
  {
    sprite.on('mousedown', () => {
      this.mouseService.leftClickDown = true;
    });

    sprite.on('rightdown', () => {
      this.mouseService.rightClickDown = true;
    })

    sprite.on('mousemove', (event) => {
      var x = Math.floor(event.data.global.x / 32);
      var y = Math.floor(event.data.global.y / 32);
      if(this.mouseService.leftClickDown)
      {
        var value = this.tileSelector.selectedValue;
        this.updateTile(x, y, value);
      }
      else if(this.mouseService.rightClickDown)
        this.map[x][y].reset();
    });

    sprite.on('mouseup', (event) => {
      var x = Math.floor(event.data.global.x / 32);
      var y = Math.floor(event.data.global.y / 32);
      if(this.mouseService.leftClickDown)
      {
        var value = this.tileSelector.selectedValue;
        this.updateTile(x, y, value);
      }
      this.mouseService.leftClickDown = false;
    });

    sprite.on('rightup', (event) => {
      var x = Math.floor(event.data.global.x / 32);
      var y = Math.floor(event.data.global.y / 32);
      if(this.mouseService.rightClickDown)
        this.map[x][y].reset();
      this.mouseService.rightClickDown = false;
    });
  }
}
