import { describe, expect, it } from 'vitest';
import { resolveWorldRoute } from './world-route';

describe('world routing contract', () => {
  it('starts café for an absent world selection', () => {
    expect(resolveWorldRoute('')).toEqual({worldId:'cafe',unknown:false});
    expect(resolveWorldRoute('#')).toEqual({worldId:'cafe',unknown:false});
  });
  it('resolves each supported direct link', () => {
    expect(resolveWorldRoute('#cafe')).toEqual({worldId:'cafe',unknown:false});
    expect(resolveWorldRoute('#greenhouse')).toEqual({worldId:'greenhouse',unknown:false});
  });
  it('falls back for unknown or malformed selections and requests a notice', () => {
    for(const hash of ['#intersection','#%zz','#greenhouse/other','#CAFE'])
      expect(resolveWorldRoute(hash)).toEqual({worldId:'cafe',unknown:true});
  });
});
