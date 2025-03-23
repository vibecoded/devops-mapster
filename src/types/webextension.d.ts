
/**
 * Type definitions for WebExtension API
 * These declarations provide TypeScript support for the browser extension API
 */

interface Browser {
  storage: {
    local: {
      get(key: string | string[] | object): Promise<any>;
      set(items: object): Promise<void>;
      remove(key: string | string[]): Promise<void>;
      clear(): Promise<void>;
    };
    sync?: {
      get(key: string | string[] | object): Promise<any>;
      set(items: object): Promise<void>;
      remove(key: string | string[]): Promise<void>;
      clear(): Promise<void>;
    };
  };
  runtime: {
    sendMessage(message: any): Promise<any>;
    onMessage: {
      addListener(callback: (message: any, sender: any, sendResponse: (response?: any) => void) => void): void;
      removeListener(callback: (message: any, sender: any, sendResponse: (response?: any) => void) => void): void;
    };
    onInstalled: {
      addListener(callback: (details: { reason: string; previousVersion?: string; }) => void): void;
    };
  };
  browserAction: {
    setBadgeText(details: { text: string; tabId?: number }): Promise<void>;
    setBadgeBackgroundColor(details: { color: string; tabId?: number }): Promise<void>;
  };
  tabs?: {
    query(queryInfo: object): Promise<any[]>;
    create(createProperties: object): Promise<any>;
    update(tabId: number, updateProperties: object): Promise<any>;
  };
}

declare global {
  const browser: Browser;
  const chrome: {
    storage: Browser['storage'];
    runtime: Browser['runtime'];
    browserAction: Browser['browserAction'];
    tabs?: Browser['tabs'];
  };
}

export {};
