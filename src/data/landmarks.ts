export interface Landmark {
  name: string
  position: [number, number, number]
  target: [number, number, number]
}

// Initial camera position (Space key returns here)
// Position and target should be very close (~0.1 distance) for first-person view
export const INITIAL_POSITION: [number, number, number] = [19, 129, 52]
export const INITIAL_TARGET: [number, number, number] = [18.9, 129, 52]

export const landmarks: Landmark[] = [
  {
    name: 'Tokyo Tower',
    position: [19, 129, 52],
    target: [18.9, 129, 52],
  },
  {
    name: 'Tokyo Skytree',
    position: [4800, -1200, 300],
    target: [4799.9, -1200, 300],
  },
  {
    name: 'Shibuya',
    position: [-2500, 5300, 150],
    target: [-2500.1, 5300, 150],
  },
  {
    name: 'Shinjuku',
    position: [-1880, 3453, 61],
    target: [-1880.1, 3453, 61],
  },
  {
    name: 'Tokyo Station',
    position: [1400, 2400, 150],
    target: [1399.9, 2400, 150],
  },
]
