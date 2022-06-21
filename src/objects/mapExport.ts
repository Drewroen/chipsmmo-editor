import { MapSetting } from './mapSetting';

export class MapExport {
  public terrain: any[][];
  public mobs: any[][];
  public spawns: any[][];
  public settings: Array<MapSetting>;

  constructor(terrain: any[][], mobs: any[][], spawns: any[][], settings: Array<MapSetting>)
  {
    this.terrain = terrain;
    this.mobs = mobs;
    this.spawns = spawns;
    this.settings = settings;
  }
}
