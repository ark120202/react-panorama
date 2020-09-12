# `react-panorama`

> React for Valve's Panorama UI (for Dota 2 Custom Games).

To get started, check out an [introductory tutorial on ModDota](https://moddota.com/panorama/react).

## Installation

To avoid wasting time on configuration, it's recommended to start with the
[JavaScript](https://github.com/ark120202/dota-templates/tree/webpack-react) or
[TypeScript](https://github.com/ark120202/dota-templates/tree/webpack-typescript-react) templates,
even if you're integrating it into an existing project.

If you want to configure tools yourself, you can follow these instructions:

### Using webpack

webpack is the recommended way to use React with Panorama. To see how webpack can be configured for
use with Panorama, check out [webpack tutorial on ModDota](https://moddota.com/panorama/webpack).

```shell
npm install react react-panorama
```

> If you are using TypeScript you also need to install `@types/react`

```jsx
import React, { useState } from 'react';
import { render } from 'react-panorama';

function Counter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);

  return (
    <Panel style={{ flowChildren: 'down' }}>
      <Label text={`Count: ${count}`} />
      <TextButton className="ButtonBevel" text="Increment" onactivate={increment} />
    </Panel>
  );
}

render(<Counter />, $.GetContextPanel());
```

### Using UMD

> Warning: UMD builds don't have a wide ecosystem support and make it harder to write idiomatic
> React code. While UMD might seem like an easier way to get started, using a bundler allows for a
> better code organization and gives you an access to a huge list of libraries built for React.

1. Download UMD bundles of [React](https://unpkg.com/react/umd/react.development.js) and
   [`react-panorama`](https://unpkg.com/react-panorama/dist/umd/react-panorama.development.js)
2. Put all downloaded files to `panorama/scripts/custom_game/libraries`
3. Include them in your layout file:

```xml
<root>
  <scripts>
    <include src="file://{resource}/scripts/custom_game/libraries/react.development.js" />
    <include src="file://{resource}/scripts/custom_game/libraries/react-panorama.development.js" />
    <!-- Your scripts -->
  </scripts>
  <Panel />
</root>
```

4. Use `React` and `ReactPanorama` globals in your script:

```js
function Counter() {
  const [count, setCount] = React.useState(0);
  const increment = () => setCount(count + 1);

  return React.createElement(
    'Panel',
    { style: { flowChildren: 'down' } },
    React.createElement('Label', { text: `Count: ${count}` }),
    React.createElement('TextButton', {
      className: 'ButtonBevel',
      text: 'Increment',
      onactivate: increment,
    }),
  );
}

ReactPanorama.render(React.createElement(Counter), $.GetContextPanel());
```

#### UMD and TypeScript

If you are using TypeScript directly via `tsc` CLI, you need to install `@types/react` and
`react-panorama` from npm, and change your `tsconfig.json` like this:

```diff
{
  "compilerOptions": {
-    "types": ["panorama-types"],
+    "types": ["panorama-types", "react", "react-panorama"],
+    "jsx": "react",
  }
}
```

Then you can use React UMD globals and JSX with type safety:

```tsx
function Counter() {
  const [count, setCount] = React.useState(0);
  const increment = () => setCount(count + 1);

  return (
    <Panel style={{ flowChildren: 'down' }}>
      <Label text={`Count: ${count}`} />
      <TextButton className="ButtonBevel" text="Increment" onactivate={increment} />
    </Panel>
  );
}

ReactPanorama.render(<Counter />, $.GetContextPanel());
```

## JSX

`react-panorama` allows to use most of known Panorama panel types as bare elements (i.e.
`<Panel />`). For a full list of supported elements check out
[renderer/panels.ts](src/renderer/panels.ts). All unsupported panel types can be used with
`<GenericPanel type="CustomPanelName" />` pseudo-element.

## API

### Renderer

#### `render(element: ReactElement, container: Panel, callback?: () => void): void`

Render a React element into the layout in the supplied container.

See [ReactDOM.render](https://reactjs.org/docs/react-dom.html#render) for more information.

#### `createPortal(children: ReactNode, container: Panel, key?: null | string): ReactPortal`

Creates a [React Portal](https://reactjs.org/docs/portals.html).

### Hooks

#### `useGameEvent(eventName: string, callback: (event: object) => void, dependencies?: DependencyList): void`

Executes `callback` every time `eventName` game event is fired.

#### `useRegisterForUnhandledEvent(event: string, callback: (...args: any[]) => void, dependencies?: DependencyList): void`

Executes `callback` every time `event` UI event is fired.

#### `useNetTableKey(name: string, key: string): object`

Gets the value of a key in a custom NetTable and updates component when it changes.

#### `useNetTableValues(name: string): object`

Gets all values in a custom NetTable and updates component when it changes.
