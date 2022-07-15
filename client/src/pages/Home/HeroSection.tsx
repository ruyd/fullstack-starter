import { Box, Button, Container, styled, Typography } from '@mui/material'
import HeroImage from '../../images/undraw_complete_design_re_h75h.svg'

const StyledImage = styled(`img`)(() => ({
  maxHeight: '20rem',
  display: 'block',
  margin: '2rem auto',
}))

export default function HeroSection({
  title = 'App that showcases drawings',
  subtitle = 'FullStack patterns showcase and sample working monorepo for TypeScript apps',
  caption = 'Get Started',
  children,
}: {
  title?: string
  subtitle?: string
  caption?: string
  children?: React.ReactNode
}) {
  return (
    <Container>
      <Box textAlign="center">
        <Typography variant="h4">{title}</Typography>
        <Typography variant="h6">{subtitle}</Typography>
        <Button variant="contained">{caption}</Button>
        {children}
      </Box>
    </Container>
  )
}