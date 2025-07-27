export interface MenuItem {
  id: string
  label: string
  href: string
  icon?: string
  description?: string
  badge?: string
  isActive?: boolean
  isDisabled?: boolean
  children?: MenuItem[]
}

export interface MenuSection {
  id: string
  title?: string
  items: MenuItem[]
}

export interface NavigationConfig {
  sections: MenuSection[]
}
