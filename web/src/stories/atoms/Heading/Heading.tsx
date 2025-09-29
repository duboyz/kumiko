interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
}

export const Heading = ({ level, children }: HeadingProps) => {
  if (level === 1) return <Heading1>{children}</Heading1>
  if (level === 2) return <Heading2>{children}</Heading2>
  if (level === 3) return <Heading3>{children}</Heading3>
  if (level === 4) return <Heading4>{children}</Heading4>
}

const Heading1 = ({ children }: { children: React.ReactNode }) => {
  return <h1 className="text-4xl">{children}</h1>
}

const Heading2 = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="text-3xl">{children}</h2>
}

const Heading3 = ({ children }: { children: React.ReactNode }) => {
  return <h3 className="text-2xl">{children}</h3>
}

const Heading4 = ({ children }: { children: React.ReactNode }) => {
  return <h4 className="text-xl">{children}</h4>
}
