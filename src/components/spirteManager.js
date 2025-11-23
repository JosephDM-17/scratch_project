import Interpreter from "./interpreter";
import { v4 as uuid } from "uuid";

export default class SpriteManager {
  constructor() {
    this.sprites = [];
    this.interpreters = new Map();
    this.selectedId = null;
    this.running = false;

    this._lastCollisionAt = new Map(); 
    this.addSprite({ x: 50, y: 50 });
    this.addSprite({ x: 200, y: 50 });
  }

  selectSprite = (id) => {
  this.selectedId = id;

  if (this.forceUpdate) {
    this.forceUpdate();   
  }
};


  // Add Sprite 
addSprite = () => {
  const id = uuid();

  const spriteWidth = 95;
  const spriteHeight = 100;
  const padding = 20; // extra space between sprites
  const avoidDist = 100; // minimum distance to avoid overlap

  // Try up to 50 random positions
  let x, y, safe = false;

  for (let attempt = 0; attempt < 50; attempt++) {
    x = Math.floor(Math.random() * 400) + 50; // random within preview zone
    y = Math.floor(Math.random() * 250) + 50;

    safe = true;

    for (const s of this.sprites) {
      const dx = s.x - x;
      const dy = s.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < avoidDist) {
        safe = false;
        break;
      }
    }

    if (safe) break;
  }

  if (!safe) {
    x = 50 + Math.random() * 200;
    y = 50 + Math.random() * 200;
  }

  const sprite = {
    id,
    x,
    y,
    rot: 0,
    script: [],
    bubble: null,
    name: `Sprite ${this.sprites.length + 1}`,
  };

  this.sprites.push(sprite);
  this.interpreters.set(id, new Interpreter(sprite, this));

  // Select the newly added sprite
  this.selectedId = id;

  // Re-render UI
  if (this.forceUpdate) this.forceUpdate();

  return sprite;
};




  getSelectedScript = () => {
    const s = this.sprites.find((x) => x.id === this.selectedId);
    return s ? s.script : null;
  };


  addNodeToSelected = (node) => {
    const s = this.sprites.find((x) => x.id === this.selectedId);
    if (!s) return;

    s.script.push(node);
    this.interpreters.set(s.id, new Interpreter(s, this));
  };


  playAll = () => {
    this.running = true;

    this.sprites.forEach((s) =>
      this.interpreters.set(s.id, new Interpreter(s, this))
    );

    const tick = () => {
      if (!this.running) return;

      this.sprites.forEach((s) => {
        this.interpreters.get(s.id).step();
      });

      this.checkCollisions();
      requestAnimationFrame(tick);
    };

    tick();
  };


  stopAll = () => {
    this.running = false;
  };


  checkCollisions = () => {
  const COLLIDE_DIST = 80;

  if (!this._collisionState) {
    this._collisionState = new Map();
  }

  const pairKey = (id1, id2) => (id1 < id2 ? `${id1}_${id2}` : `${id2}_${id1}`);

  for (let i = 0; i < this.sprites.length; i++) {
    for (let j = i + 1; j < this.sprites.length; j++) {
      const a = this.sprites[i];
      const b = this.sprites[j];

      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const key = pairKey(a.id, b.id);

      const wasColliding = this._collisionState.get(key) === true;
      const isColliding = dist < COLLIDE_DIST;

     
      if (!wasColliding && isColliding) {
        console.log(
          `[HERO] Collision detected — swapping scripts of ${a.name} and ${b.name}`
        );


        const temp = JSON.parse(JSON.stringify(a.script));
        a.script = JSON.parse(JSON.stringify(b.script));
        b.script = temp;


        this.interpreters.set(a.id, new Interpreter(a, this));
        this.interpreters.set(b.id, new Interpreter(b, this));

        this._collisionState.set(key, true); 
      }


      if (!isColliding && wasColliding) {
        this._collisionState.set(key, false); 
      }
    }
  }
};


  deleteSprite = (id) => {

  this.sprites = this.sprites.filter(s => s.id !== id);


  this.interpreters.delete(id);


  if (this.sprites.length > 0) {
    this.selectedId = this.sprites[0].id;
  } else {
    this.selectedId = null;
  }


  if (this.forceUpdate) this.forceUpdate();
};
}
