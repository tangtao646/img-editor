declare global {
  interface AdsByGoogle extends Array<any> {
    loaded?: boolean;
  }

  interface Window {
    adsbygoogle: AdsByGoogle;
  }
}

export {};