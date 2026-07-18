const ALGIERS_TZ = "Africa/Algiers";

export function getAlgiersNow(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: ALGIERS_TZ })
  );
}

/** Friday opens at 17h; other days 9h–23h */
export function isOpenNow(override?: boolean | null): boolean {
  if (override === true) return true;
  if (override === false) return false;

  const now = getAlgiersNow();
  const day = now.getDay(); // 0 Sun, 5 Fri
  const hour = now.getHours() + now.getMinutes() / 60;

  if (day === 5) return hour >= 17 && hour < 23;
  return hour >= 9 && hour < 23;
}

export function getOpenStatusLabel(override?: boolean | null): string {
  return isOpenNow(override) ? "Ouvert maintenant" : "Fermé";
}

export function getHoursLabel(): string {
  return "9h – 23h · Vendredi dès 17h";
}
