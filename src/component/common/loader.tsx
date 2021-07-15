import React from 'react'
export const loadView = (path: string) => {
  return React.lazy(() => import('@/views/' + path))
}
