import { ExoticComponent } from 'react';
import * as attributes from './attribute-types';

export interface AttributesByPanel {
  Panel: attributes.PanelAttributes;
  Label: attributes.LabelAttributes;

  Image: attributes.ImageAttributes;
  DOTAAbilityImage: attributes.DOTAAbilityImageAttributes;
  DOTAItemImage: attributes.DOTAItemImageAttributes;
  DOTAHeroImage: attributes.DOTAHeroImageAttributes;
  DOTACountryFlagImage: attributes.DOTACountryFlagImageAttributes;
  DOTALeagueImage: attributes.DOTALeagueImageAttributes;
  EconItemImage: attributes.EconItemImageAttributes;

  AnimatedImageStrip: attributes.AnimatedImageStripAttributes;
  DOTAEmoticon: attributes.DOTAEmoticonAttributes;

  Movie: attributes.MovieAttributes;
  DOTAHeroMovie: attributes.DOTAHeroMovieAttributes;

  DOTAScenePanel: attributes.DOTAScenePanelAttributes;
  DOTAEconItem: attributes.DOTAEconItemAttributes;

  ProgressBar: attributes.ProgressBarAttributes;
  CircularProgressBar: attributes.CircularProgressBarAttributes;
  ProgressBarWithMiddle: attributes.ProgressBarWithMiddleAttributes;

  DOTAUserName: attributes.DOTAUserNameAttributes;
  DOTAUserRichPresence: attributes.DOTAUserRichPresenceAttributes;
  DOTAAvatarImage: attributes.DOTAAvatarImageAttributes;

  Countdown: attributes.CountdownAttributes;

  Button: attributes.PanelAttributes;
  TextButton: attributes.TextButtonAttributes;
  ToggleButton: attributes.ToggleButtonAttributes;
  RadioButton: attributes.RadioButtonAttributes;

  TextEntry: attributes.TextEntryAttributes;
  NumberEntry: attributes.NumberEntryAttributes;
  Slider: attributes.SliderAttributes;
  SlottedSlider: attributes.SlottedSliderAttributes;

  DropDown: attributes.DropDownAttributes;
  ContextMenuScript: attributes.PanelAttributes;

  Carousel: attributes.CarouselAttributes;
  CarouselNav: attributes.CarouselNavAttributes;

  DOTAHUDOverlayMap: attributes.DOTAHUDOverlayMapAttributes;
  DOTAMinimap: attributes.PanelAttributes;

  HTML: attributes.HTMLAttributes;

  CustomLayoutPanel: attributes.CustomLayoutPanelAttributes;
  GenericPanel: attributes.GenericPanelAttributes;
}

export type PanelType = keyof AttributesByPanel;
export type PanelTypeByName<T extends PanelType> = PanoramaPanelNameMap[Extract<
  T,
  keyof PanoramaPanelNameMap
>];

declare global {
  /* eslint-disable no-var, vars-on-top */
  var Panel: ExoticComponent<attributes.PanelAttributes>;
  var Label: ExoticComponent<attributes.LabelAttributes>;

  var Image: ExoticComponent<attributes.ImageAttributes>;
  var DOTAAbilityImage: ExoticComponent<attributes.DOTAAbilityImageAttributes>;
  var DOTAItemImage: ExoticComponent<attributes.DOTAItemImageAttributes>;
  var DOTAHeroImage: ExoticComponent<attributes.DOTAHeroImageAttributes>;
  var DOTACountryFlagImage: ExoticComponent<attributes.DOTACountryFlagImageAttributes>;
  var DOTALeagueImage: ExoticComponent<attributes.DOTALeagueImageAttributes>;
  var EconItemImage: ExoticComponent<attributes.EconItemImageAttributes>;

  var AnimatedImageStrip: ExoticComponent<attributes.AnimatedImageStripAttributes>;
  var DOTAEmoticon: ExoticComponent<attributes.DOTAEmoticonAttributes>;

  var Movie: ExoticComponent<attributes.MovieAttributes>;
  var DOTAHeroMovie: ExoticComponent<attributes.DOTAHeroMovieAttributes>;

  var DOTAScenePanel: ExoticComponent<attributes.DOTAScenePanelAttributes>;
  var DOTAEconItem: ExoticComponent<attributes.DOTAEconItemAttributes>;

  var ProgressBar: ExoticComponent<attributes.ProgressBarAttributes>;
  var CircularProgressBar: ExoticComponent<attributes.CircularProgressBarAttributes>;
  var ProgressBarWithMiddle: ExoticComponent<attributes.ProgressBarWithMiddleAttributes>;

  var DOTAUserName: ExoticComponent<attributes.DOTAUserNameAttributes>;
  var DOTAUserRichPresence: ExoticComponent<attributes.DOTAUserRichPresenceAttributes>;
  var DOTAAvatarImage: ExoticComponent<attributes.DOTAAvatarImageAttributes>;

  var Countdown: ExoticComponent<attributes.CountdownAttributes>;

  var Button: ExoticComponent<attributes.PanelAttributes>;
  var TextButton: ExoticComponent<attributes.TextButtonAttributes>;
  var ToggleButton: ExoticComponent<attributes.ToggleButtonAttributes>;
  var RadioButton: ExoticComponent<attributes.RadioButtonAttributes>;

  var TextEntry: ExoticComponent<attributes.TextEntryAttributes>;
  var NumberEntry: ExoticComponent<attributes.NumberEntryAttributes>;
  var Slider: ExoticComponent<attributes.SliderAttributes>;
  var SlottedSlider: ExoticComponent<attributes.SlottedSliderAttributes>;

  var DropDown: ExoticComponent<attributes.DropDownAttributes>;
  var ContextMenuScript: ExoticComponent<attributes.PanelAttributes>;

  var Carousel: ExoticComponent<attributes.CarouselAttributes>;
  var CarouselNav: ExoticComponent<attributes.CarouselNavAttributes>;

  var DOTAHUDOverlayMap: ExoticComponent<attributes.DOTAHUDOverlayMapAttributes>;
  var DOTAMinimap: ExoticComponent<attributes.PanelAttributes>;

  var HTML: ExoticComponent<attributes.HTMLAttributes>;

  var CustomLayoutPanel: ExoticComponent<attributes.CustomLayoutPanelAttributes>;
  /**
   * This element allows to render any unsupported Panorama panel type.
   * All unknown attributes are assumed to be XML properties.
   *
   * @example
   * return (
   *   <GenericPanel
   *     type="DOTABuffList"
   *     showdebuffs={false}
   *     style={{ backgroundColor: 'black' }}
   *   />
   * );
   */
  var GenericPanel: ExoticComponent<attributes.GenericPanelAttributes>;
  /* eslint-enable */
}

// eslint-disable-next-line no-new-func
const global: typeof globalThis = new Function('return this')();

for (const panelName of [
  'Panel',
  'Label',

  'Image',
  'DOTAAbilityImage',
  'DOTAItemImage',
  'DOTAHeroImage',
  'DOTACountryFlagImage',
  'DOTALeagueImage',
  'EconItemImage',

  'AnimatedImageStrip',
  'DOTAEmoticon',

  'Movie',
  'DOTAHeroMovie',

  'DOTAScenePanel',
  'DOTAEconItem',

  'ProgressBar',
  'CircularProgressBar',
  'ProgressBarWithMiddle',

  'DOTAUserName',
  'DOTAUserRichPresence',
  'DOTAAvatarImage',

  'Countdown',

  'Button',
  'TextButton',
  'ToggleButton',
  'RadioButton',

  'TextEntry',
  'NumberEntry',
  'Slider',
  'SlottedSlider',

  'DropDown',
  'ContextMenuScript',

  'Carousel',
  'CarouselNav',

  'DOTAHUDOverlayMap',
  'DOTAMinimap',

  'HTML',

  'CustomLayoutPanel',
  'GenericPanel',
] as const) {
  global[panelName] = panelName as any;
}
