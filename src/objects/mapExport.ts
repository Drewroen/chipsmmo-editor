import { MapSetting } from './mapSetting';
import { MapTile } from './mapTile';

export class MapExport {
  public gameMap: TileExport[][];
  public settings: Array<MapSetting>;

  constructor(gameMap: MapTile[][], settings: Array<MapSetting>)
  {
    this.gameMap = gameMap.map(a => a.map(b => {
      return {
        terrain: b.terrainValue,
        mob: b.mobValue,
        spawn: b.spawnValue
      };
    }));
    this.settings = settings;
  }

  public toString()
  {
    return JSON.stringify({
      gameMap: this.gameMap,
      settings: this.settings
    });
  }
}

export class TileExport {
  public terrain: number;
  public mob: number;
  public spawn: number;
}
