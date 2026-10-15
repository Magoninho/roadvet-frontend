/**
 * Visual language shared by every screen after login, modeled on the home screen (itself inspired
 * by Nubank's): a solid brand-colored header block, a flat white body, light-gray filled surfaces
 * instead of borders and shadows, and sections separated by thin full-width dividers.
 */

export const COLORS = {
  brand: '#12B4C4',
  /** Translucent white for avatars and round buttons placed on the brand header. */
  brandOverlay: 'rgba(255, 255, 255, 0.22)',
  onBrand: '#FFFFFF',
  onBrandMuted: 'rgba(255, 255, 255, 0.85)',
  bg: '#FFFFFF',
  /** Filled background of inputs, cards, pills and round action buttons. */
  surface: '#F0F2F5',
  textDark: '#0F1E3D',
  textMuted: '#8A8A8A',
  placeholder: '#A3A9B3',
  divider: '#EEEEEE',
  danger: '#E85C5C',
  dangerSoft: '#FDECEC',
};

export const SPACING = {
  /** Horizontal margin between the screen edge and its content. */
  gutter: 20,
  /** Gap above a section's content. */
  section: 24,
  /** Gap between larger blocks, e.g. above a divider. */
  block: 28,
};

export const RADIUS = {
  control: 12,
  sheet: 20,
};
