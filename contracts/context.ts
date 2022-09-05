import { DateTime } from 'luxon/src/datetime'

declare module '@ioc:Adonis/Core/HttpContext' {
  interface HttpContextContract {
    user: User
  }
}

export interface User {
  id: number
  username: string
  email: string
  is_active: boolean
  roles: Array<Role>
  permissions: Array<Permission>
}

export interface Role {
  id: number
  name: string
  description: string | null
  created_at: DateTime
  updated_at: DateTime
}

export interface Permission {
  id: number
  name: string
  description: string | null
  created_at: DateTime
  updated_at: DateTime
}

export function hasRoleOrPermission(
  user: User,
  check: { role: string; permission: string }
): boolean {
  const foundRole = user.roles.find((role) => role.name === check.role)
  const foundPermission = user.permissions.find((permission) => permission.name === check.role)

  // eslint-disable-next-line eqeqeq
  if (foundPermission == null || foundRole == null) {
    return false
  }

  return true
}
