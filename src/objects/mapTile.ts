import * as PIXI from 'pixi.js';

export class MapTile
{
  public terrainValue: number;
  public terrainSprite: PIXI.Sprite;
  public mobValue: number;
  public mobSprite: PIXI.Sprite;
  public spawnValue: number;
  public spawnSprite: PIXI.Sprite;

  constructor(x: number, y: number)
  {
    this.terrainValue = 0;
    this.terrainSprite = new PIXI.Sprite();
    this.terrainSprite.x = x;
    this.terrainSprite.y = y;
    this.terrainSprite.texture = this.generateTerrainTileTexture(0);
    this.terrainSprite.interactive = true;

    this.mobValue = -1;
    this.mobSprite = new PIXI.Sprite();
    this.mobSprite.x = x;
    this.mobSprite.y = y;
    this.mobSprite.texture = null;

    this.spawnValue = -1;
    this.spawnSprite = new PIXI.Sprite();
    this.spawnSprite.x = x;
    this.spawnSprite.y = y;
    this.spawnSprite.alpha = .3;
  }

  public reset()
  {
    this.terrainValue = 0;
    this.terrainSprite.texture = this.generateTerrainTileTexture(0);

    this.mobValue = -1;
    this.mobSprite.texture = null;

    this.spawnValue = -1;
    this.spawnSprite.texture = null;
  }

  public updateTerrain(value: number)
  {
    this.terrainValue = value;
    this.terrainSprite.texture = this.generateTerrainTileTexture(value);
  }

  public updateMob(value: number)
  {
    this.mobValue = value;
    this.mobSprite.texture = this.generateMobTileTexture(value);
  }

  public updateSpawn(value: number)
  {
    this.spawnValue = value;
    this.spawnSprite.texture = this.generateSpawnTileTexture(value);
  }

  protected generateTerrainTileTexture(x: number)
  {
    let base = PIXI.Texture.from('./../assets/TILESET_TERRAIN.png');
    let texture = new PIXI.Texture(base.baseTexture, new PIXI.Rectangle(32 * (x % 12), 32 * ((x - (x % 12)) / 12), 32, 32));
    return texture;
  }

  protected generateMobTileTexture(x: number)
  {
    if (x < 0)
      return;
    let base = PIXI.Texture.from('./../assets/TILESET_MOB.png');
    let texture = new PIXI.Texture(base.baseTexture, new PIXI.Rectangle(32 * (x % 12), 32 * ((x - (x % 12)) / 12), 32, 32));
    return texture;
  }

  protected generateSpawnTileTexture(x: number)
  {
    if (x < 0)
      return;
    let base = PIXI.Texture.from('./../assets/TILESET_SPAWN.png');
    let texture = new PIXI.Texture(base.baseTexture, new PIXI.Rectangle(32 * (x % 12), 32 * ((x - (x % 12)) / 12), 32, 32));
    return texture;
  }
}
