interface CenterContainerProps {
  children: React.ReactNode
}
export function CenterContainer({ children }: CenterContainerProps): React.ReactNode {
  return <div className="h-[calc(100vh-64px)] flex justify-center items-center">{children}</div>
}
