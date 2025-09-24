import { Heading } from './Heading'

const meta = {
  title: 'Components/Heading',
  component: Heading,
}

export default meta

export const H1 = () => <Heading level={1} children="Kumiko æ" />
export const H2 = () => <Heading level={2} children="Heading 2" />
export const H3 = () => <Heading level={3} children="Heading 3" />
export const H4 = () => <Heading level={4} children="Heading 4" />
