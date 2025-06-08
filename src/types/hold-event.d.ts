declare module 'hold-event' {
  export class ElementHold {
    constructor(element: HTMLElement, interval?: number)
    _holdStart(): void
    _holdEnd(): void
    addEventListener(event: string, callback: (event: { deltaTime: number }) => void): void
    removeEventListener(event: string, callback: (event: { deltaTime: number }) => void): void
  }
} 