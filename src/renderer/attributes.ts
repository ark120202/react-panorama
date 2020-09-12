/* eslint-disable @typescript-eslint/prefer-optional-chain */
import { InternalPanel, noop, queueMicrotask } from '../utils';
import { PanelAttributes } from './attribute-types';
import { panelBaseNames } from './panel-base';
import { AttributesByPanel, PanelType, PanelTypeByName } from './panels';

const enum PropertyType {
  SET,
  SETTER,
  INITIAL_ONLY,
  CUSTOM,
}

type AttributesMatchingType<TPanel extends PanelBase, TType> = {
  [P in keyof TPanel]: [TType] extends [TPanel[P]] ? P : never;
}[keyof TPanel];

type PropertyInformation<
  TName extends PanelType,
  TAttribute extends keyof AttributesByPanel[TName]
> = { initial?: boolean | string; throwOnIncomplete?: true } & (
  | {
      type: PropertyType.SET;
      name: AttributesMatchingType<
        PanelTypeByName<TName>,
        // TODO:
        NonNullable<AttributesByPanel[TName][TAttribute]>
      >;
    }
  | {
      type: PropertyType.SETTER;
      name: AttributesMatchingType<
        PanelTypeByName<TName>,
        // TODO:
        (value: NonNullable<AttributesByPanel[TName][TAttribute]>) => void
      >;
    }
  | {
      type: PropertyType.INITIAL_ONLY;
      initial: boolean | string;
    }
  | {
      type: PropertyType.CUSTOM;
      update(
        panel: InternalPanel<PanelTypeByName<TName>>,
        newValue: AttributesByPanel[TName][TAttribute],
        oldValue: AttributesByPanel[TName][TAttribute],
        propName: TAttribute,
      ): void;
    }
);

const panelPropertyInformation: {
  [TName in PanelType]?: {
    [TAttribute in keyof AttributesByPanel[TName]]?: PropertyInformation<TName, TAttribute>;
  };
} = {};

type PanelPropertyInformation<TName extends PanelType> = {
  [TAttribute in Exclude<
    keyof AttributesByPanel[TName],
    keyof PanelAttributes | PanelEvent
  >]: PropertyInformation<TName, TAttribute>;
};
function definePanelPropertyInformation<TName extends PanelType>(
  name: TName,
  properties: PanelPropertyInformation<TName>,
) {
  panelPropertyInformation[name] = properties as any;
}

const PANORAMA_INVALID_DATE = 2 ** 52;

const propertiesInformation: {
  [TAttribute in Exclude<
    keyof PanelAttributes,
    'key' | 'ref' | 'children' | PanelEvent
  >]: PropertyInformation<'Panel', TAttribute>;
} = {
  id: { type: PropertyType.INITIAL_ONLY, initial: false },

  hittest: { type: PropertyType.SET, name: 'hittest', initial: true, throwOnIncomplete: true },
  hittestchildren: {
    type: PropertyType.SET,
    name: 'hittestchildren',
    initial: true,
    throwOnIncomplete: true,
  },
  acceptsfocus: { type: PropertyType.SETTER, name: 'SetAcceptsFocus', initial: true },
  // @ts-expect-error tabindex setter accepts 'auto'
  tabindex: { type: PropertyType.SET, name: 'tabindex', initial: true, throwOnIncomplete: true },
  inputnamespace: {
    type: PropertyType.SET,
    name: 'inputnamespace',
    initial: true,
    throwOnIncomplete: true,
  },

  dangerouslyCreateChildren: {
    type: PropertyType.CUSTOM,
    update(panel, newValue) {
      panel.RemoveAndDeleteChildren();
      if (newValue) {
        const status = panel.BCreateChildren(newValue);
        if (!status) {
          const indentedLayout = newValue.replace(/^/gm, '    ');
          throw new Error(
            `Cannot create children for "dangerouslyCreateChildren":\n${indentedLayout}`,
          );
        }
      }
    },
  },

  dialogVariables: {
    type: PropertyType.CUSTOM,
    update(panel, newValue = {}, oldValue = {}) {
      function unassignDialogVariable(key: string, old: string | number | Date | undefined) {
        if (old !== undefined) return;

        if (typeof old === 'string') {
          panel.SetDialogVariable(key, `[!s:${key}]`);
        } else if (typeof old === 'number') {
          // eslint-disable-next-line unicorn/prefer-number-properties
          panel.SetDialogVariableInt(key, NaN);
        } else {
          panel.SetDialogVariableTime(key, PANORAMA_INVALID_DATE);
        }
      }

      for (const key in newValue) {
        const value = newValue[key];
        if (value !== oldValue[key]) {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (value === undefined) {
            unassignDialogVariable(key, oldValue[key]);
          } else if (typeof value === 'string') {
            panel.SetDialogVariable(key, value);
          } else if (typeof value === 'number') {
            panel.SetDialogVariableInt(key, value);
          } else {
            panel.SetDialogVariableTime(key, Math.floor(value.getTime() / 1000));
          }
        }
      }

      for (const key in oldValue) {
        if (!(key in newValue)) {
          unassignDialogVariable(key, oldValue[key]);
        }
      }
    },
  },

  style: {
    type: PropertyType.CUSTOM,
    update(panel, newValue: any = {}, oldValue: any = {}) {
      for (const styleName in newValue) {
        if (newValue[styleName] !== oldValue[styleName]) {
          panel.style[styleName as keyof VCSSStyleDeclaration] = newValue[styleName];
        }
      }

      for (const styleName in oldValue) {
        if (!(styleName in newValue)) {
          panel.style[styleName as keyof VCSSStyleDeclaration] = null;
        }
      }
    },
    throwOnIncomplete: true,
  },

  className: {
    type: PropertyType.CUSTOM,
    initial: 'class',
    update(panel, newValue = '', oldValue = '') {
      const newClasses = newValue.split(' ');

      for (const className of newClasses) {
        panel.AddClass(className);
      }

      for (const className of oldValue.split(' ')) {
        if (!newClasses.includes(className)) {
          panel.RemoveClass(className);
        }
      }
    },
  },

  draggable: { type: PropertyType.SETTER, name: 'SetDraggable' },
};

const labelTextAttributes = {
  // Number can be assigned to text
  text: { type: PropertyType.SET, name: 'text' as never },
  localizedText: { type: PropertyType.INITIAL_ONLY, initial: 'text' },
  // Label.html setter doesn't appear to work correctly
  html: { type: PropertyType.INITIAL_ONLY, initial: true },
} as const;

definePanelPropertyInformation('Label', {
  ...labelTextAttributes,
  allowtextselection: { type: PropertyType.INITIAL_ONLY, initial: true },
});

const imageAttributes: PanelPropertyInformation<'Image'> = {
  scaling: { type: PropertyType.SETTER, name: 'SetScaling', initial: true },
  src: { type: PropertyType.SETTER, name: 'SetImage', initial: true },
};

definePanelPropertyInformation('Image', imageAttributes);

definePanelPropertyInformation('DOTAAbilityImage', {
  ...imageAttributes,
  abilityname: { type: PropertyType.SET, name: 'abilityname', initial: true },
  contextEntityIndex: { type: PropertyType.SET, name: 'contextEntityIndex' },
  showtooltip: { type: PropertyType.INITIAL_ONLY, initial: true },
  abilityid: { type: PropertyType.INITIAL_ONLY, initial: true },
});

definePanelPropertyInformation('DOTAItemImage', {
  ...imageAttributes,
  itemname: { type: PropertyType.SET, name: 'itemname', initial: true },
  contextEntityIndex: { type: PropertyType.SET, name: 'contextEntityIndex' },
  showtooltip: { type: PropertyType.INITIAL_ONLY, initial: true },
});

definePanelPropertyInformation('DOTAHeroImage', {
  ...imageAttributes,
  heroid: { type: PropertyType.SET, name: 'heroid', initial: true },
  heroname: { type: PropertyType.SET, name: 'heroname', initial: true },
  heroimagestyle: { type: PropertyType.SET, name: 'heroimagestyle', initial: true },
  usedefaultimage: { type: PropertyType.INITIAL_ONLY, initial: true },
});

definePanelPropertyInformation('DOTACountryFlagImage', {
  ...imageAttributes,
  country_code: { type: PropertyType.INITIAL_ONLY, initial: true },
});

definePanelPropertyInformation('DOTALeagueImage', {
  ...imageAttributes,
  leagueid: { type: PropertyType.SET, name: 'leagueid', initial: true },
  leagueimagestyle: { type: PropertyType.INITIAL_ONLY, initial: true },
});

definePanelPropertyInformation('EconItemImage', {
  ...imageAttributes,
  itemdef: { type: PropertyType.INITIAL_ONLY, initial: true },
});

const animatedImageStripAttributes: PanelPropertyInformation<'AnimatedImageStrip'> = {
  ...imageAttributes,
  frametime: { type: PropertyType.INITIAL_ONLY, initial: true },
  defaultframe: { type: PropertyType.INITIAL_ONLY, initial: true },
  animating: { type: PropertyType.INITIAL_ONLY, initial: true },
};

definePanelPropertyInformation('AnimatedImageStrip', animatedImageStripAttributes);

definePanelPropertyInformation('DOTAEmoticon', {
  ...animatedImageStripAttributes,
  emoticonid: { type: PropertyType.INITIAL_ONLY, initial: true },
  alias: { type: PropertyType.INITIAL_ONLY, initial: true },
});

definePanelPropertyInformation('Movie', {
  src: { type: PropertyType.SETTER, name: 'SetMovie', initial: true },
  controls: { type: PropertyType.SETTER, name: 'SetControls', initial: true },
  repeat: { type: PropertyType.SETTER, name: 'SetRepeat', initial: true },
  title: { type: PropertyType.SETTER, name: 'SetTitle', initial: true },
  autoplay: { type: PropertyType.INITIAL_ONLY, initial: true },
});

definePanelPropertyInformation('DOTAHeroMovie', {
  heroid: { type: PropertyType.SET, name: 'heroid', initial: true },
  heroname: { type: PropertyType.SET, name: 'heroname', initial: true },
  persona: { type: PropertyType.SET, name: 'persona' },
  autoplay: { type: PropertyType.INITIAL_ONLY, initial: true },
});

const createSceneRotationSetter = <TProp extends 'pitchmin' | 'pitchmax' | 'yawmin' | 'yawmax'>(
  propName: TProp,
): PropertyInformation<'DOTAScenePanel', TProp> => ({
  type: PropertyType.CUSTOM,
  update(panel, newValue) {
    if (panel._rotateParams === undefined) panel._rotateParams = {};
    panel._rotateParams[propName] = newValue;
    panel.SetRotateParams(
      panel._rotateParams.yawmin || 0,
      panel._rotateParams.yawmax || 0,
      panel._rotateParams.pitchmin || 0,
      panel._rotateParams.pitchmax || 0,
    );
  },
});

definePanelPropertyInformation('DOTAScenePanel', {
  // TODO: panel.SetUnit?
  unit: { type: PropertyType.INITIAL_ONLY, initial: true },
  'activity-modifier': { type: PropertyType.INITIAL_ONLY, initial: true },

  map: { type: PropertyType.INITIAL_ONLY, initial: true },
  camera: { type: PropertyType.INITIAL_ONLY, initial: true },
  light: { type: PropertyType.INITIAL_ONLY, initial: true },

  pitchmin: createSceneRotationSetter('pitchmin'),
  pitchmax: createSceneRotationSetter('pitchmax'),
  yawmin: createSceneRotationSetter('yawmin'),
  yawmax: createSceneRotationSetter('yawmax'),
  allowrotation: { type: PropertyType.INITIAL_ONLY, initial: true },
  rotateonhover: { type: PropertyType.INITIAL_ONLY, initial: true },
  rotateonmousemove: { type: PropertyType.INITIAL_ONLY, initial: true },

  antialias: { type: PropertyType.INITIAL_ONLY, initial: true },
  panoramasurfaceheight: { type: PropertyType.INITIAL_ONLY, initial: true },
  panoramasurfacewidth: { type: PropertyType.INITIAL_ONLY, initial: true },
  panoramasurfacexml: { type: PropertyType.INITIAL_ONLY, initial: true },
  particleonly: { type: PropertyType.INITIAL_ONLY, initial: true },
  renderdeferred: { type: PropertyType.INITIAL_ONLY, initial: true },
  rendershadows: { type: PropertyType.INITIAL_ONLY, initial: true },
});

definePanelPropertyInformation('DOTAEconItem', {
  itemdef: {
    type: PropertyType.CUSTOM,
    update(panel, newValue) {
      panel._econItemDef = newValue;
      panel.SetItemByDefinitionAndStyle(panel._econItemDef || 0, panel._econItemStyle || 0);
    },
  },
  itemstyle: {
    type: PropertyType.CUSTOM,
    update(panel, newValue) {
      panel._econItemStyle = newValue;
      panel.SetItemByDefinitionAndStyle(panel._econItemDef || 0, panel._econItemStyle || 0);
    },
  },
});

const progressBarAttributes: PanelPropertyInformation<'CircularProgressBar'> = {
  value: { type: PropertyType.SET, name: 'value', initial: true },
  min: { type: PropertyType.SET, name: 'min', initial: true },
  max: { type: PropertyType.SET, name: 'max', initial: true },
};
definePanelPropertyInformation('ProgressBar', progressBarAttributes);
definePanelPropertyInformation('CircularProgressBar', progressBarAttributes);
definePanelPropertyInformation('ProgressBarWithMiddle', {
  lowervalue: { type: PropertyType.SET, name: 'lowervalue', initial: true },
  uppervalue: { type: PropertyType.SET, name: 'uppervalue', initial: true },
  min: { type: PropertyType.SET, name: 'min', initial: true },
  max: { type: PropertyType.SET, name: 'max', initial: true },
});

const steamIdAttribute: PropertyInformation<'DOTAUserName', 'steamid'> = {
  type: PropertyType.CUSTOM,
  initial: true,
  update(panel, newValue = '0') {
    // XML attribute supports "local" value, but JS setter doesn't
    if (newValue === 'local') {
      panel.steamid = Game.GetLocalPlayerInfo().player_steamid;
    } else {
      panel.steamid = newValue;
    }
  },
};

definePanelPropertyInformation('DOTAUserName', { steamid: steamIdAttribute });
definePanelPropertyInformation('DOTAUserRichPresence', { steamid: steamIdAttribute });
definePanelPropertyInformation('DOTAAvatarImage', {
  steamid: steamIdAttribute,
  nocompendiumborder: { type: PropertyType.INITIAL_ONLY, initial: true },
  lazy: { type: PropertyType.INITIAL_ONLY, initial: true },
});

definePanelPropertyInformation('Countdown', {
  startTime: { type: PropertyType.SET, name: 'startTime', initial: 'start-time' },
  endTime: { type: PropertyType.SET, name: 'endTime', initial: 'end-time' },

  updateInterval: { type: PropertyType.SET, name: 'updateInterval' },
  timeDialogVariable: { type: PropertyType.SET, name: 'timeDialogVariable' },
});

definePanelPropertyInformation('TextButton', labelTextAttributes);

definePanelPropertyInformation('ToggleButton', {
  ...labelTextAttributes,
  selected: { type: PropertyType.SET, name: 'checked' },
  html: { type: PropertyType.INITIAL_ONLY, initial: true },
});

definePanelPropertyInformation('RadioButton', {
  group: { type: PropertyType.INITIAL_ONLY, initial: true },
  text: { type: PropertyType.INITIAL_ONLY, initial: true },
  html: { type: PropertyType.INITIAL_ONLY, initial: true },
  selected: { type: PropertyType.SET, name: 'checked' },
});

definePanelPropertyInformation('TextEntry', {
  text: { type: PropertyType.SET, name: 'text' },
  multiline: { type: PropertyType.INITIAL_ONLY, initial: true },
  maxchars: { type: PropertyType.SETTER, name: 'SetMaxChars', initial: true },
  placeholder: { type: PropertyType.INITIAL_ONLY, initial: true },
  textmode: { type: PropertyType.INITIAL_ONLY, initial: true },
});

definePanelPropertyInformation('NumberEntry', {
  value: { type: PropertyType.SET, name: 'value', initial: true },
  increment: { type: PropertyType.SET, name: 'increment', initial: true },

  // panel.value = panel.value refreshes increment and decrement buttons
  /* eslint-disable no-self-assign */
  min: {
    type: PropertyType.CUSTOM,
    initial: true,
    update(panel, newValue = 0) {
      panel.min = newValue;
      panel.value = panel.value;
    },
  },
  max: {
    type: PropertyType.CUSTOM,
    initial: true,
    update(panel, newValue = 1000000) {
      panel.max = newValue;
      panel.value = panel.value;
    },
  },
  /* eslint-enable no-self-assign */
});

const sliderAttributes: PanelPropertyInformation<'Slider'> = {
  // panel.SetDirection doesn't seem to work
  direction: { type: PropertyType.INITIAL_ONLY, initial: true },
  value: { type: PropertyType.SETTER, name: 'SetValueNoEvents' },
  min: { type: PropertyType.SET, name: 'min' },
  max: { type: PropertyType.SET, name: 'max' },
};
definePanelPropertyInformation('Slider', sliderAttributes);
definePanelPropertyInformation('SlottedSlider', {
  ...sliderAttributes,
  notches: { type: PropertyType.INITIAL_ONLY, initial: true },
});

definePanelPropertyInformation('DropDown', {
  selected: {
    type: PropertyType.CUSTOM,
    update(panel, newValue) {
      // Defer update until children are created
      queueMicrotask(() => newValue && panel.SetSelected(newValue));
    },
  },
});

definePanelPropertyInformation('Carousel', {
  focus: { type: PropertyType.INITIAL_ONLY, initial: true },
  'focus-offset': { type: PropertyType.INITIAL_ONLY, initial: true },
  wrap: { type: PropertyType.INITIAL_ONLY, initial: true },
  selectionposboundary: { type: PropertyType.INITIAL_ONLY, initial: true },
  'panels-visible': { type: PropertyType.INITIAL_ONLY, initial: true },
  clipaftertransform: { type: PropertyType.INITIAL_ONLY, initial: true },
  AllowOversized: { type: PropertyType.INITIAL_ONLY, initial: true },
  'autoscroll-delay': { type: PropertyType.INITIAL_ONLY, initial: true },
  'x-offset': { type: PropertyType.INITIAL_ONLY, initial: true },
});

definePanelPropertyInformation('CarouselNav', {
  carouselid: { type: PropertyType.INITIAL_ONLY, initial: true },
});

definePanelPropertyInformation('DOTAHUDOverlayMap', {
  maptexture: { type: PropertyType.SET, name: 'maptexture', initial: true },
  mapscale: { type: PropertyType.SET, name: 'mapscale', initial: true },
  mapscroll: { type: PropertyType.SET, name: 'mapscroll' },
  fixedoffsetenabled: { type: PropertyType.SET, name: 'fixedoffsetenabled' },
  fixedOffset: {
    type: PropertyType.CUSTOM,
    update(panel, newValue: { x?: number; y?: number } = {}) {
      panel.SetFixedOffset(newValue.x || 0, newValue.y || 0);
    },
  },
  fixedBackgroundTexturePosition: {
    type: PropertyType.CUSTOM,
    update(panel, newValue: { size?: number; x?: number; y?: number } = {}) {
      panel.SetFixedBackgroundTexturePosition(newValue.size || 0, newValue.x || 0, newValue.y || 0);
    },
  },
});

definePanelPropertyInformation('HTML', {
  url: { type: PropertyType.SETTER, name: 'SetURL', initial: true },
});

definePanelPropertyInformation('CustomLayoutPanel', {
  layout: { type: PropertyType.INITIAL_ONLY, initial: true },
});

const genericPanelPropertyInfo: PropertyInformation<'GenericPanel', string> = {
  type: PropertyType.INITIAL_ONLY,
  initial: true,
};

const uiEventPropertyInfo: PropertyInformation<'Panel', any> = {
  type: PropertyType.CUSTOM,
  update(panel, newValue, _oldValue, propName) {
    panel._eventHandlers ??= {};

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (panel._eventHandlers[propName] === undefined) {
      $.RegisterEventHandler(propName.slice(6), panel, (...args) =>
        panel._eventHandlers![propName](...args),
      );
    }

    panel._eventHandlers[propName] = newValue !== undefined ? newValue : noop;
  },
};

const panelEventPropertyInfo: PropertyInformation<'Panel', any> = {
  type: PropertyType.CUSTOM,
  update(panel, newValue, _oldValue, propName) {
    // Unlike UI event handlers, it's not required to use an object here,
    // because SetPanelEvent overrides previous listener,
    // but we're still using it here as a potential performance optimization
    panel._eventHandlers ??= {};

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (panel._eventHandlers[propName] === undefined) {
      panel.SetPanelEvent(propName, () => panel._eventHandlers![propName](panel));
    }

    panel._eventHandlers[propName] = newValue !== undefined ? newValue : noop;
  },
};

function getPropertyInfo(
  type: PanelType,
  propName: string,
): PropertyInformation<any, any> | undefined {
  const propertyInformation = propertiesInformation[propName as keyof typeof propertiesInformation];
  if (
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    propertyInformation !== undefined &&
    !(panelBaseNames.has(type) && propertyInformation.type === PropertyType.SET)
  ) {
    return propertyInformation;
  }

  const panelProperty = (panelPropertyInformation[type] as any)?.[propName];
  if (panelProperty) return panelProperty;

  if (propName === 'children') return undefined;

  if (propName.startsWith('on-ui-')) return uiEventPropertyInfo;
  if (propName.startsWith('on')) return panelEventPropertyInfo;

  if (type === 'GenericPanel') return genericPanelPropertyInfo;

  if (process.env.BUILD_ENV === 'development') {
    console.warn(`Attribute "${propName}" on panel of type "${type}" is unknown`);
    return genericPanelPropertyInfo;
  }
}

export function splitInitialProps(type: PanelType, props: Record<string, any>) {
  let hasInitialProps = false;
  const initialProps: Record<string, any> = {};
  const otherProps: Record<string, any> = {};

  for (const propName in props) {
    const propertyInformation = getPropertyInfo(type, propName);

    if (propertyInformation && propertyInformation.initial) {
      const initialName =
        typeof propertyInformation.initial === 'string' ? propertyInformation.initial : propName;
      hasInitialProps = true;
      initialProps[initialName] = props[propName];
    } else if (propName !== 'id') {
      otherProps[propName] = props[propName];
    }
  }

  return { initialProps: hasInitialProps ? initialProps : undefined, otherProps };
}

export function updateProperty(
  type: PanelType,
  panel: InternalPanel,
  propName: string,
  oldValue: any,
  newValue: any,
) {
  const propertyInformation = getPropertyInfo(type, propName);
  if (!propertyInformation) {
    // Ignore unknown properties
    return;
  }

  if (panelBaseNames.has(type) && propertyInformation.throwOnIncomplete) {
    throw new Error(
      `Attribute "${propName}" cannot be ${
        propertyInformation.initial ? 'changed on' : 'added to'
      } incomplete ${type} panel type.${
        propertyInformation.initial ? ' Add a "key" attribute to force re-mount.' : ''
      }`,
    );
  }

  switch (propertyInformation.type) {
    case PropertyType.SET:
      (panel as any)[propertyInformation.name] = newValue;
      break;
    case PropertyType.SETTER:
      (panel as any)[propertyInformation.name](newValue);
      break;
    case PropertyType.INITIAL_ONLY:
      throw new Error(
        `Attribute "${propName}" cannot be changed. Add a "key" attribute to force re-mount.`,
      );
    case PropertyType.CUSTOM:
      propertyInformation.update(panel, newValue, oldValue, propName);
      break;
  }
}
