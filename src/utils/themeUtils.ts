export const getLuminance = (hex: string): number => {
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;

  const sRGB = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow(((v + 0.055) / 1.055), 2.4);
  });

  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
};

export const getContrastStyle = (bgHex: string) => {
  const lum = getLuminance(bgHex);
  const isBackgroundLight = lum > 0.6;

  return {
    isLight: isBackgroundLight,
    primary: isBackgroundLight ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,1)',
    secondary: isBackgroundLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)',
    textClass: isBackgroundLight ? 'text-black/80' : 'text-white',
    subTextClass: isBackgroundLight ? 'text-black/50' : 'text-white/60',
    heatmapClass: (count: number) => {
       if (count === 0) return isBackgroundLight ? "bg-black/5" : "bg-white/10";
       if (count <= 2) return isBackgroundLight ? "bg-black/20" : "bg-white/30";
       if (count <= 5) return isBackgroundLight ? "bg-black/50" : "bg-white/60";
       return isBackgroundLight ? "bg-black" : "bg-white";
    }
  };
};