/**
 * Safely prepends Astro's configured BASE_URL to a relative or root-relative path.
 * When base is '/AKSNOVA_web': returns '/AKSNOVA_web/path'
 * When base is '/' (root or custom domain): returns '/path'
 */
export function withBase(path: string = ''): string {
  const envBase = (typeof process !== 'undefined' && process.env && process.env['ASTRO_BASE']) || '';
  const metaBase = import.meta.env?.BASE_URL;
  const effectiveBase = (metaBase && metaBase !== '/') ? metaBase : (envBase || metaBase || '/');
  const base = effectiveBase.replace(/\/+$/, '');

  if (!path || path === '/' || path === '') {
    return base ? `${base}/` : '/';
  }

  // Handle anchor paths like '/#journey' or '#journey'
  if (path.startsWith('/#')) {
    return `${base}/#${path.slice(2)}`;
  }
  if (path.startsWith('#')) {
    return path;
  }

  // Handle absolute protocols
  if (/^(https?:|mailto:|tel:|\/\/)/.test(path)) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
