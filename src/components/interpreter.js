export default class Interpreter {
  constructor(sprite, manager) {
    this.sprite = sprite;
    this.manager = manager;

    this.ip = 0;
    this.waitUntil = 0;
  }

  step() {
    const now = Date.now();
    if (this.waitUntil > now) return;

    const script = this.sprite.script;
    if (this.ip >= script.length) return;

    const node = script[this.ip];
    this.exec(node);

    this.ip += 1;
  }

  exec(node) {
    const [cat, cmd] = node.type.split(":");

    if (cat === "motion") {
      if (cmd === "move") {
        const rad = (this.sprite.rot * Math.PI) / 180;
        this.sprite.x += Math.cos(rad) * node.args.steps;
        this.sprite.y += Math.sin(rad) * node.args.steps;
      }

      if (cmd === "turn") {
        this.sprite.rot += node.args.deg;
      }

      if (cmd === "goto") {
        this.sprite.x = node.args.x;
        this.sprite.y = node.args.y;
      }
    }

    if (cat === "looks") {
      if (cmd === "say") {
        this.sprite.bubble = node.args.text;
        this.waitUntil = Date.now() + node.args.sec * 1000;

        setTimeout(() => {
          this.sprite.bubble = null;
        }, node.args.sec * 1000);
      }

      if (cmd === "think") {
        this.sprite.bubble = `(${node.args.text})`;
        this.waitUntil = Date.now() + node.args.sec * 1000;

        setTimeout(() => {
          this.sprite.bubble = null;
        }, node.args.sec * 1000);
      }
    }
  }
}
