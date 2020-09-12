import { ReactElement, ReactNode, ReactPortal } from 'react';
import { InternalPanel, reactPanoramaSymbol } from '../utils';
import './panels';
import { reconciler } from './reconciler';

export * from './attribute-types';

/**
 * Render a React element into the layout in the supplied container.
 *
 * See [ReactDOM.render](https://reactjs.org/docs/react-dom.html#render) for more information.
 */
export function render(element: ReactElement, container: Panel, callback?: () => void) {
  const panel = container as InternalPanel;

  if (panel._reactPanoramaSymbol !== reactPanoramaSymbol) {
    panel._reactPanoramaSymbol = reactPanoramaSymbol;
    // Container was used in the previous reload cycle
    panel._rootContainer = undefined;
  }

  panel._rootContainer ??= reconciler.createContainer(panel, false, false);

  // @ts-expect-error callback type should be nullable
  reconciler.updateContainer(element, panel._rootContainer, null, callback);
}

// https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactPortal.js
const REACT_PORTAL_TYPE = Symbol.for('react.portal');

/**
 * Creates a [React Portal](https://reactjs.org/docs/portals.html).
 */
export function createPortal(
  children: ReactNode,
  container: Panel,
  key?: null | string,
): ReactPortal {
  const portal = {
    $$typeof: REACT_PORTAL_TYPE,
    key: key == null ? null : String(key),
    children,
    containerInfo: container,
  };

  return portal as any;
}
