import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { Scene } from 'phaser';
import { BoardLocation } from '../interface/board-location';
import { Direction } from '../enums/direction.enum';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class GameBoardService {
  private game: Phaser.Game;
  private hWallDimensions: BoardLocation = {x: 50, y: 4};

  init(parentId: string): void {
    this.game = new Phaser.Game(this.getGameConfig(parentId));
  }

  constructor(private gameService: GameService) {
    gameBoardService = this;
  }

  getGameConfig(parentId: string) {
    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: parentId,
      physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
      },
      scene: {
          preload: preload,
          create: create,
          update: update
      }
    };
  }

  public updateScene(scene: Scene) {

  }

  public preloadScene(scene: Scene) {
    scene.load.image('vWall', 'assets/Vertical Wall.png');
    scene.load.image('hWall', 'assets/Horizontal Wall.png');
  }

  public createScene(scene: Scene) {
    this.addWalls(scene);
    //this.gameService.board.board[0][0]
  }

  private addWalls(scene: Scene): void {
    for (let row = 0; row < this.gameService.board.board.length; ++row) {
      const cols = this.gameService.board.board[row].split('');
      const prevCols = row - 1 >= 0 ? this.gameService.board.board[row - 1].split('') :
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
      for (let col = 0; col < cols.length; ++col) {
        if ('┌┬─┐ '.indexOf(cols[col]) >= 0 || '└┘┴─'.indexOf(prevCols[col]) >= 0) {
          const loc = this.getPositionFromLocation(scene, {x: col, y: row}, 0);
          scene.add.image(.5 * this.hWallDimensions.x + loc.x, .5 * this.hWallDimensions.y + loc.y, 'hWall');
        }
      }
    }
  }

  private getPositionFromLocation(scene: Scene, loc: BoardLocation, cellOffset: number = .5): BoardLocation {
    const getOffset = (numCells: number, boardSize: number, coordinate: number): number => (coordinate + cellOffset) * boardSize / numCells;
    return {
      x: getOffset(16, <number>scene.game.config.width, loc.x),
      y: getOffset(12, <number>scene.game.config.height, loc.y)
    };
  }
}

let gameBoardService: GameBoardService;
let player: Phaser.Physics.Arcade.Sprite;
let cursors: Phaser.Input.Keyboard.CursorKeys;
const curPosition = <BoardLocation>{x: 15, y: 0};
let directionTraveling: Direction;


function create(): void {
  const scene: Scene = this;
  //scene.add.image(400, 300, 'sky');
  const pos = getPositionFromLocation(scene, curPosition);
  player = scene.physics.add.sprite(pos.x, pos.y, 'dude');

  cursors = scene.input.keyboard.createCursorKeys();

  animateBob(scene, 'down', 1, 4);
  animateBob(scene, 'up', 5, 8);
  animateBob(scene, 'right', 9, 12);
  animateBob(scene, 'left', 13, 16);
  animateBob(scene, 'idown', 17, 21);
  animateBob(scene, 'iup', 22, 26);
  animateBob(scene, 'iright', 27, 31);
  animateBob(scene, 'ileft', 32, 36);
  player.anims.play('iright', true);
  gameBoardService.createScene(this);
}

function animateBob(scene: Scene, key: string, start: number, end: number) {
  scene.anims.create({
    key,
    frames: scene.anims.generateFrameNumbers('dude', { start, end }),
    frameRate: key[0] === 'i' ? 1 : 7,
    repeat: -1
  });
}

function preload(): void {
  let scene: Phaser.Scene;
  scene = this;
  //scene.load.image('sky', 'assets/sky.png');
  scene.load.spritesheet('dude', 'assets/bob.png', { frameWidth: 32, frameHeight: 32 });
  gameBoardService.preloadScene(this);
}

function update(): void {
  const scene: Scene = this;
  const pos = getPositionFromLocation(scene, curPosition);
  const speed = 100;

  if (directionTraveling === Direction.left && player.x < pos.x) {
    player.x = pos.x;
    player.setVelocity(0, 0);
    player.anims.play('ileft', true);
    directionTraveling = undefined;
  } else if (directionTraveling === Direction.right && player.x > pos.x) {
    player.x = pos.x;
    player.setVelocity(0, 0);
    player.anims.play('iright', true);
    directionTraveling = undefined;
  } else if (directionTraveling === Direction.up && player.y < pos.y) {
    player.y = pos.y;
    player.setVelocity(0, 0);
    player.anims.play('iup', true);
    directionTraveling = undefined;
  } else if (directionTraveling === Direction.down && player.y > pos.y) {
    player.y = pos.y;
    player.setVelocity(0, 0);
    player.anims.play('idown', true);
    directionTraveling = undefined;
  }

  if (directionTraveling === undefined && cursors.left.isDown) {
    curPosition.x -= 1;
    player.setVelocity(-speed, 0);
    player.anims.play('left', true);
    directionTraveling = Direction.left;
  } else if (directionTraveling === undefined && cursors.right.isDown) {
    curPosition.x += 1;
    player.setVelocity(speed, 0);
    player.anims.play('right', true);
    directionTraveling = Direction.right;
  } else if (directionTraveling === undefined && cursors.up.isDown) {
    curPosition.y -= 1;
    player.setVelocity(0, -speed);
    player.anims.play('up', true);
    directionTraveling = Direction.up;
  } else if (directionTraveling === undefined && cursors.down.isDown) {
    curPosition.y += 1;
    player.setVelocity(0, speed);
    player.anims.play('down', true);
    directionTraveling = Direction.down;
  }
  gameBoardService.updateScene(this);
}

function getPositionFromLocation(scene: Scene, loc: BoardLocation): BoardLocation {
  const getOffset = (numCells: number, boardSize: number, coordinate: number): number => (coordinate + .5) * boardSize / numCells;
  return {
    x: getOffset(16, <number>scene.game.config.width, loc.x),
    y: getOffset(12, <number>scene.game.config.height, loc.y)
  };
}


