/* eslint-disable @typescript-eslint/no-empty-interface */
import { ClassAttributes, ReactNode } from 'react';

type EventHandler<T extends PanelBase> = (panel: T) => void;
export interface PanelAttributes<T extends PanelBase = Panel> extends ClassAttributes<T> {
  children?: ReactNode;
  dangerouslyCreateChildren?: string;
  dialogVariables?: Record<string, string | number | Date>;

  id?: string;
  className?: string;
  style?: Partial<VCSSStyleDeclaration>;
  hittest?: boolean;
  hittestchildren?: boolean;
  acceptsfocus?: boolean;
  tabindex?: number | 'auto';
  inputnamespace?: string;
  draggable?: boolean;
  // TODO: sectionpos?: 'auto';?

  onload?: EventHandler<T>;
  onfocus?: EventHandler<T>;
  onactivate?: EventHandler<T>;
  onmouseactivate?: EventHandler<T>;
  ondblclick?: EventHandler<T>;
  oncontextmenu?: EventHandler<T>;
  onmouseover?: EventHandler<T>;
  onmouseout?: EventHandler<T>;
  onmovedown?: EventHandler<T>;
  onmoveleft?: EventHandler<T>;
  onmoveright?: EventHandler<T>;
  onmoveup?: EventHandler<T>;
  oncancel?: EventHandler<T>;
  ontabforward?: EventHandler<T>;
}

interface LabelLikeAttributes<T extends Panel> extends PanelAttributes<T> {
  /**
   * Note: Using this attribute is the same as assigning `text` property on a Label panel - it does
   * not localize strings and ignores dialog variables. If you need the behavior of XML attribute,
   * use `localizedText` instead.
   */
  text?: string | number;
  localizedText?: string;
  html?: boolean;
}

export interface LabelAttributes extends LabelLikeAttributes<LabelPanel> {
  allowtextselection?: boolean;
}

export interface ImageAttributes<T extends ImagePanel = ImagePanel> extends PanelAttributes<T> {
  src?: string;
  scaling?: ScalingFunction;
}

export interface DOTAAbilityImageAttributes extends ImageAttributes<AbilityImage> {
  abilityname?: string;
  abilityid?: number;
  contextEntityIndex?: AbilityEntityIndex;
  /** @default false */
  showtooltip?: boolean;
}

export interface DOTAItemImageAttributes extends ImageAttributes<ItemImage> {
  itemname?: string;
  contextEntityIndex?: ItemEntityIndex;
  /** @default true */
  showtooltip?: boolean;
}

export interface DOTAHeroImageAttributes extends ImageAttributes<HeroImage> {
  heroname?: string;
  heroid?: HeroID;
  heroimagestyle?: 'icon' | 'portrait' | 'landscape';
  usedefaultimage?: boolean;
}

export interface DOTACountryFlagImageAttributes extends ImageAttributes {
  country_code?: string;
}

export interface DOTALeagueImageAttributes extends ImageAttributes<LeagueImage> {
  leagueid?: number;
  /** @default 'Banner' */
  leagueimagestyle?: 'Banner' | 'Square' | 'LargeIcon';
}

export interface EconItemImageAttributes extends ImageAttributes {
  itemdef: number;
}

export interface AnimatedImageStripAttributes extends ImageAttributes {
  frametime?: string;
  defaultframe?: number;
  animating?: boolean;
}

export interface DOTAEmoticonAttributes extends AnimatedImageStripAttributes {
  emoticonid?: number;
  alias?: string;
}

export type MovieAutoPlay = 'off' | 'onload' | 'onfocus';

export interface MovieAttributes extends PanelAttributes<MoviePanel> {
  src?: string;
  repeat?: boolean;
  controls?: Parameters<MoviePanel['SetControls']>[0];
  title?: string;
  /** @default 'onload' */
  autoplay?: MovieAutoPlay;
}

export interface DOTAHeroMovieAttributes extends PanelAttributes<HeroMovie> {
  heroid?: HeroID;
  heroname?: string;
  persona?: any;
  /** @default 'off' */
  autoplay?: MovieAutoPlay;
}

export interface DOTAScenePanelAttributes extends PanelAttributes<ScenePanel> {
  unit?: string;
  'activity-modifier'?: string;

  map?: string;
  camera?: string;
  light?: string;

  pitchmin?: number;
  pitchmax?: number;
  yawmin?: number;
  yawmax?: number;
  allowrotation?: boolean;
  rotateonhover?: boolean;
  rotateonmousemove?: boolean;

  // acceleration?: number;
  antialias?: boolean;
  // deferredalpha?: any;
  // drawbackground?: boolean;
  // environment?: any;
  // 'live-mode'?: any;
  panoramasurfaceheight?: number;
  panoramasurfacewidth?: number;
  panoramasurfacexml?: string;
  particleonly?: boolean;
  // 'pin-fov'?: any;
  renderdeferred?: boolean;
  rendershadows?: boolean;
  // renderwaterreflections?: boolean;
}

export interface DOTAEconItemAttributes extends PanelAttributes<EconItemPanel> {
  itemdef: number;
  itemstyle?: number;
}

export interface ProgressBarAttributes extends PanelAttributes<ProgressBar> {
  value?: number;
  min?: number;
  max?: number;
}

export interface CircularProgressBarAttributes extends PanelAttributes<CircularProgressBar> {
  value?: number;
  min?: number;
  max?: number;
}

export interface ProgressBarWithMiddleAttributes extends PanelAttributes<ProgressBarWithMiddle> {
  lowervalue?: number;
  uppervalue?: number;
  min?: number;
  max?: number;
}

export interface DOTAUserNameAttributes extends PanelAttributes<UserName> {
  steamid?: string | 'local';
}

export interface DOTAUserRichPresenceAttributes extends PanelAttributes<UserRichPresence> {
  steamid?: string | 'local';
}

export interface DOTAAvatarImageAttributes extends PanelAttributes<AvatarImage> {
  steamid?: string | 'local';
  nocompendiumborder?: boolean;
  lazy?: boolean;
}

export interface CountdownAttributes extends PanelAttributes<CountdownPanel> {
  startTime?: number;
  endTime: number;
  /** @default 1 */
  updateInterval?: number;
  /** @default 'countdown_time' */
  timeDialogVariable?: string;
}

export interface TextButtonAttributes extends LabelLikeAttributes<TextButton> {}

export interface ToggleButtonAttributes extends LabelLikeAttributes<ToggleButton> {
  selected?: boolean; // checked?
  onselect?: EventHandler<RadioButton>;
  ondeselect?: EventHandler<RadioButton>;
}

export interface RadioButtonAttributes extends PanelAttributes<RadioButton> {
  group?: string;
  text?: string;
  html?: boolean;

  selected?: boolean;
  onselect?: EventHandler<RadioButton>;
  ondeselect?: EventHandler<RadioButton>;
}

export interface TextEntryAttributes extends PanelAttributes<TextEntry> {
  multiline?: boolean;
  placeholder?: string;
  maxchars?: number;
  textmode?: 'normal' | 'password' | 'numeric' | 'numericpassword';

  text?: string;
  ontextentrychange?: EventHandler<TextEntry>;
  oninputsubmit?: EventHandler<TextEntry>;
  // ontextentrysubmit doesn't seem to be ever triggered
}

export interface NumberEntryAttributes extends PanelAttributes<NumberEntry> {
  value?: number;
  onvaluechanged?: EventHandler<NumberEntry>;
  /** @default 0 */
  min?: number;
  /** @default 1000000 */
  max?: number;
  /** @default 1 */
  increment?: number;
}

export interface SliderAttributes<T extends SliderPanel = SliderPanel> extends PanelAttributes<T> {
  style?: never;

  value?: number;
  onvaluechanged?: EventHandler<T>;

  /** @default 0 */
  min?: number;

  /** @default 1 */
  max?: number;

  /**
   * Note: to make slider horizontal it also should have a `HorizontalSlider` class.
   *
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal';
}

export interface SlottedSliderAttributes<T extends SlottedSlider = SlottedSlider>
  extends SliderAttributes<T> {
  notches?: number;
}

export interface DropDownAttributes extends PanelAttributes<DropDown> {
  selected?: string;
  oninputsubmit?: EventHandler<DropDown>;
}

// Untested
export interface CarouselAttributes extends PanelAttributes<CarouselPanel> {
  focus?: 'center' | 'edge';
  'focus-offset'?: string;
  wrap?: boolean;
  selectionposboundary?: string;
  'panels-visible'?: number;
  clipaftertransform?: boolean;
  AllowOversized?: any;
  'autoscroll-delay'?: string;
  'x-offset'?: string;
}

export interface CarouselNavAttributes extends PanelAttributes {
  carouselid?: string;
}

export interface DOTAHUDOverlayMapAttributes extends PanelAttributes<HUDOverlayMap> {
  maptexture?: string;
  /** @default 4 */
  mapscale?: number;
  /** @default true */
  mapscroll?: boolean;
  /** @default false */
  fixedoffsetenabled?: boolean;
  fixedOffset?: { x: number; y: number };
  fixedBackgroundTexturePosition?: { size: number; x: number; y: number };
}

export interface HTMLAttributes extends PanelAttributes<HTML> {
  url?: string;
  // SetIgnoreCursor doesn't seem to do anything
}

export interface CustomLayoutPanelAttributes extends PanelAttributes {
  layout: string;
}

export interface GenericPanelAttributes extends PanelAttributes {
  type: string;
  [key: string]: any;
}
