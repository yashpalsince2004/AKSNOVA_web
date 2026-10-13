import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => {},
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

window.HTMLElement.prototype.scrollIntoView = function () {};

// Default mock for fetch in test environment
process.env["PUBLIC_SUPABASE_URL"] =
  process.env["PUBLIC_SUPABASE_URL"] || "https://test.supabase.co";
process.env["PUBLIC_SUPABASE_ANON_KEY"] =
  process.env["PUBLIC_SUPABASE_ANON_KEY"] || "test-anon-key";

if (typeof globalThis.fetch === "undefined" || vi.isMockFunction(globalThis.fetch) === false) {
  globalThis.fetch = vi.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
      text: () => Promise.resolve(JSON.stringify({ success: true })),
    } as Response),
  );
}
