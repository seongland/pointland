export interface Landmark {
  name: string
  position: [number, number, number]
  target: [number, number, number]
}

// Initial camera position (Space key returns here)
// Target = position + direction * 0.1
export const INITIAL_POSITION: [number, number, number] = [18.62, 128.11, 52.57]
export const INITIAL_TARGET: [number, number, number] = [18.53, 128.13, 52.54]

export const landmarks: Landmark[] = [
  {
    name: 'Tokyo Tower',
    position: [18.62, 128.11, 52.57],
    target: [18.53, 128.13, 52.54],
  },
  {
    name: 'Tokyo Skytree',
    position: [5637.2, 6134.95, 300.01],
    target: [5637.11, 6134.91, 300.0],
  },
  {
    name: 'Shibuya',
    position: [-4678.16, 167.57, -6.47],
    target: [-4678.19, 167.66, -6.51],
  },
  {
    name: 'Shinjuku',
    position: [-4292.97, 2976.89, 32.6],
    target: [-4293.04, 2976.97, 32.59],
  },
  {
    name: 'Tokyo Station',
    position: [922.11, 2830.73, -147.92],
    target: [922.21, 2830.7, -147.93],
  },
]
