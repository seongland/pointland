/*
 * @summary - Local Storage Module for Camera Position
 */

const STORAGE_KEY = 'pointland-camera'

export interface CameraState {
  position: [number, number, number] | null
  target: [number, number, number] | null
}

export const getStoredCamera = (): CameraState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.warn('Failed to parse stored camera state:', e)
  }
  return { position: null, target: null }
}

export const saveCamera = (position: [number, number, number], target: [number, number, number]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ position, target }))
  } catch (e) {
    console.warn('Failed to save camera state:', e)
  }
}

export const clearStoredCamera = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.warn('Failed to clear camera state:', e)
  }
}
