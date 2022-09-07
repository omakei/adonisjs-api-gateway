import { DateTime } from 'luxon/src/datetime'
import UserModel from 'App/Models/User'

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

export async function hasRoleOrPermission(
  user: UserModel,
  check: {
    roles: Array<string>
    permission: string
  }
): Promise<boolean> {
  await user.load((loader) => {
    loader.load('roles').load('permissions')
  })

  const foundRole = user.roles.find((role) =>
    check.roles.find((requiredRole) => role.name === requiredRole)
  )

  const foundPermission = user.permissions.find(
    (permission) => permission.name === check.permission
  )

  // eslint-disable-next-line eqeqeq
  if (foundPermission?.id != null) {
    return true
  }

  // eslint-disable-next-line eqeqeq
  if (foundRole?.id != null) {
    return true
  }

  return false
}
