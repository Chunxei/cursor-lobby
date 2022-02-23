export interface ICursorProps {
  id: string
  x: number
  y: number
  message: string
  isTyping?: boolean
  color?: string
  name?: string
  onMessageChange?: (message: string) => any
  onType?: (typing: boolean) => any
  lastSeen?: string
  role?: string
  mine?: boolean
}
