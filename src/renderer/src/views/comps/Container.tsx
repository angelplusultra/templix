interface ContainerProps {
  children: React.ReactNode
}
export function Container({ children }: ContainerProps) {
  return <div className="container mx-auto">{children}</div>
}
