export type WorldId = 'cafe' | 'greenhouse';
export interface WorldRoute { worldId: WorldId; unknown: boolean }

/** Pure route resolution; loading/disposal belongs to the later shell runtime. */
export function resolveWorldRoute(hash: string): WorldRoute {
  const name = hash.startsWith('#') ? hash.slice(1) : hash;
  if (name === '' || name === 'cafe') return { worldId: 'cafe', unknown: false };
  if (name === 'greenhouse') return { worldId: 'greenhouse', unknown: false };
  return { worldId: 'cafe', unknown: true };
}
