export interface Landmark {
  name: string
  position: [number, number, number]
  target: [number, number, number]
}

export const landmarks: Landmark[] = [
  {
    name: 'Tokyo Tower',
    position: [-4300, 3100, 500],
    target: [-4300, 3100, 0],
  },
  {
    name: 'Tokyo Skytree',
    position: [4800, -1200, 800],
    target: [4800, -1200, 0],
  },
  {
    name: 'Shibuya',
    position: [-2500, 5300, 300],
    target: [-2500, 5300, 0],
  },
  {
    name: 'Shinjuku',
    position: [-1500, 3200, 400],
    target: [-1500, 3200, 0],
  },
  {
    name: 'Tokyo Station',
    position: [1400, 2400, 300],
    target: [1400, 2400, 0],
  },
]
