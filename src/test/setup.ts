import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { clearTestQueryClients } from "./queryClient";

class TestResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

class TestIntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

const installBrowserMocks = () => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    })),
  });

  Object.defineProperty(globalThis, "ResizeObserver", {
    configurable: true,
    writable: true,
    value: TestResizeObserver,
  });
  Object.defineProperty(globalThis, "IntersectionObserver", {
    configurable: true,
    writable: true,
    value: TestIntersectionObserver,
  });
};

export const UNSIMULATED_HTTP_ERROR = "Solicitud HTTP no simulada";

const installNetworkGuard = () => {
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    writable: true,
    value: vi.fn<typeof fetch>(() => {
      throw new Error(UNSIMULATED_HTTP_ERROR);
    }),
  });
};

installBrowserMocks();
installNetworkGuard();
beforeEach(() => {
  installBrowserMocks();
  installNetworkGuard();
});

if (!document.head.querySelector("style[data-test-motion='disabled']")) {
  const style = document.createElement("style");
  style.dataset.testMotion = "disabled";
  style.textContent = `
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
  `;
  document.head.appendChild(style);
}

afterEach(() => {
  cleanup();
  clearTestQueryClients();
  vi.clearAllMocks();
});
