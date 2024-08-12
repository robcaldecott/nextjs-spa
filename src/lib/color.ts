export function getColorName(color: string) {
  return `${color[0].toLocaleUpperCase()}${color.slice(1)}`;
}

export function getWebColor(color: string) {
  switch (color) {
    case "sky blue":
      return "#87CEEB";
    case "mint green":
      return "#98FB98";
    default:
      return color;
  }
}
