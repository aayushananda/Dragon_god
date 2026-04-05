# Summon Dragon 🐉🔥

A captivating ASCII terminal animation featuring a majestic dragon entering the screen against a dynamic, physics-based fire background.

![Summon Dragon Demo](./render1775404114849.gif)

## Features

- **Dynamic Fire Simulation**: A custom, real-time particle-based fire effect using custom intensity algorithms and character mapping.
- **Smooth Animations**: The dragon gracefully enters from the bottom of the screen to rest perfectly in the center, running at roughly 30 FPS. 
- **Graceful Terminal Integration**: Handles dynamic terminal resizing seamlessly, hiding the cursor during the process and restoring the terminal properly.
- **True Color Colors**: Leverages custom ANSI escape code generation to colorize the artwork correctly.

## Prerequisites

- **Node.js**: Requires ESM module support (Node 12.20.0+).

## Global Installation (The `summon-dragon` command)

You can link the tool in your system globally so that you can simply type `summon-dragon` from any directory to run this animation.

To install it globally, navigate to the project root directory and run:

```bash
npm install
npm link
```

After linking, you can summon the dragon by typing:

```bash
summon-dragon
```

### Running Locally without Link

If you don't wish to link it globally, you can execute it manually from the directory:

```bash
npm install
node index.js
```

## Controls

- To quit the animation and restore your terminal cursor, simply press `Ctrl + C`.

## Technologies

- Standard `Node.js` APIs (fs, child_process, URL).
- `cli-cursor`: Manages toggling terminal cursor state.
- `package.json` specifies `"type": "module"` for deep ESM support.
