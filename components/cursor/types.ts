export interface ICursorProps {
  id: string
  x: number
  y: number
  name: string
  message: string
  isTyping?: boolean
  color?: string
  onNameChange?: (message: string) => any
  onMessageChange?: (message: string) => any
  onType?: (typing: boolean) => any
  lastSeen?: string
  role?: string
  mine?: boolean
}
