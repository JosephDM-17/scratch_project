export default class Interpreter {
  constructor(sprite, manager) {
    this.sprite = sprite;
    this.manager = manager;

    // Stack of execution scopes: { nodes: [], idx: 0, loop: { count, iter } }
    this.stack = [{ nodes: sprite.script, idx: 0 }];
    this.waitUntil = 0;
  }

  step() {
    const now = Date.now();
    if (this.waitUntil > now) return;

    // Find the next executable node
    while (this.stack.length > 0) {
      const frame = this.stack[this.stack.length - 1];

      // Check if frame is done
      if (frame.idx >= frame.nodes.length) {
        // If it's a loop, check if we need to repeat
        if (frame.loop) {
          frame.loop.iter++;
          if (frame.loop.iter < frame.loop.count) {
            frame.idx = 0; // Restart loop
            continue; // Continue execution in this frame
          }
        }
        // otherwise pop
        this.stack.pop();
        continue;
      }

      const node = frame.nodes[frame.idx];

      if (node.type === "control:repeat") {
        frame.idx++; // Advance past the repeat block in parent
        
        // Push child scope
        this.stack.push({
          nodes: node.children || [],
          idx: 0,
          loop: { count: node.args.count, iter: 0 }
        });
        // We continue the loop to immediately execute the first child (or check if empty)
        continue;
      }

      // Regular command
      this.exec(node);
      frame.idx++;
      return; // Yield after one command
    }
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
