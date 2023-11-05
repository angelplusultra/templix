interface ContainerProps {
  children: React.ReactNode
}
export function Container({ children }: ContainerProps): React.ReactNode {
  return <div className="container mx-auto">{children}</div>
}
