export type Nullable<T> = T | null | undefined

import 'react'

declare module 'react' {
  interface HTMLAttributes<T> {
    onPointerEnterCapture?: (e: React.PointerEvent<T>) => void
    onPointerLeaveCapture?: (e: React.PointerEvent<T>) => void
    placeholder?: unknown
    crossOrigin?: unknown
  }
  interface RefAttributes<T> {
    onPointerEnterCapture?: (e: React.PointerEvent<T>) => void
    onPointerLeaveCapture?: (e: React.PointerEvent<T>) => void
    placeholder?: unknown
    crossOrigin?: unknown
  }
}