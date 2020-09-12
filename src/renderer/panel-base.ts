import { temporaryPanelHost } from '../utils';

export const panelBaseNames: ReadonlySet<string> = new Set([
  'CircularProgressBar',
  'Slider',
  'SlottedSlider',
]);

export function fixPanelBase(panel: PanelBase) {
  for (const [key, value] of Object.entries(temporaryPanelHost)) {
    if (typeof value === 'function') {
      (panel as any)[key] = value;
    }
  }
}
