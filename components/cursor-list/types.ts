import {IUser} from '../../state/lobby/types';

export interface ICursorListProps {
  users: Record<string, IUser>
  excludeIds: string[]
  hostId?: string
}
