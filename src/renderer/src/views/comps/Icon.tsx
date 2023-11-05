import { BiLogoTypescript, BiLogoMongodb, BiLogoPostgresql } from 'react-icons/bi'
import { FaFolder, FaNode, FaReact } from 'react-icons/fa'

export const icons: App.Icons = {
  react: FaReact,
  typescript: BiLogoTypescript,
  node: FaNode,
  mongodb: BiLogoMongodb,
  postgres: BiLogoPostgresql
}
export function Icon({ icon, styles }: App.IconProps): React.ReactNode {
  const IComp = icons[icon] || FaFolder

  return <IComp className={styles} />
}
