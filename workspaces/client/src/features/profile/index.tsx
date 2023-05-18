/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AttachMoney,
  CurrencyExchange,
  GifBoxTwoTone,
  Image,
  MailOutline,
  Money,
  MoneyOff,
  OutletRounded,
  Person2,
  Person3,
  Person4,
  SupervisedUserCircle
} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Drawing, User } from '@lib'
import React from 'react'
import { useGet } from '../../features/app'
import { BlurBackdrop } from '../../features/ui/BlurBackdrop'
import Gallery from '../../features/ui/Gallery'
import TabPanel from '../../features/ui/TabPanel'
import { useAppSelector } from '../../shared/store'
import AddressForm from '../shop/Address'
import UserEdit from './Edit'
import Orders from './Orders'
import Subscription from './Subscription'

export function Profile(): JSX.Element {
  const user = useAppSelector(state => state.app.user)
  const activeSubscription = useAppSelector(state => state.shop.activeSubscription)
  const wallet = useAppSelector(state => state.shop.wallet)
  const theme = useTheme()
  const [tab, setTab] = React.useState(0)
  const [background, setBackground] = React.useState('')

  function onGalleryData(items: Drawing[]) {
    setBackground(`${items[0]?.thumbnail}`)
  }

  return (
    <Container sx={{ marginTop: '2.5vw' }}>
      <Card sx={{ borderRadius: '20px' }}>
        <CardContent
          sx={{
            backgroundColor: theme.palette.primary.main,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'end',
            alignItems: 'flex-start',
            padding: '.7rem .7rem .7rem 8rem',
            position: 'relative',
            minHeight: '100px',
            transition: 'all 0.3s ease',
            [theme.breakpoints.down('sm')]: {
              alignItems: 'center',
              textAlign: 'center',
              padding: '.7rem'
            }
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${background})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              backgroundSize: '200% 200%',
              filter: 'blur(5px)'
            }}
          ></Box>
          <Avatar
            src={user?.picture}
            sx={{
              height: '6rem',
              width: '6rem',
              background: theme.palette.primary.light,
              position: 'absolute',
              bottom: '-70%',
              left: '60px',
              transform: 'translate(-50%, -50%)',
              border: '2px solid',
              borderColor: theme.palette.background.paper,
              transition: 'all 0.3s',
              [theme.breakpoints.down('sm')]: {
                height: '5rem',
                width: '5rem',
                bottom: '-50%'
              }
            }}
          />
          <Typography variant="h4">
            {user?.firstName} {user?.lastName}
          </Typography>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="body1">{user?.email}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                Coins: {parseInt((wallet?.balance ?? 0) as unknown as string)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                Subscription: {activeSubscription?.title || 'None'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <Box sx={{ height: '50px' }}>
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v as number)}
            centered
            sx={{
              alignItems: 'end'
            }}
          >
            <Tab label="Modify" icon={<Person3 />} iconPosition="start" />
            <Tab label="Subscription" icon={<CurrencyExchange />} iconPosition="start" />
            <Tab label="Addresses" icon={<MailOutline />} iconPosition="start" />
            <Tab label="Orders" icon={<AttachMoney />} iconPosition="start" />
            <Tab label="Gallery" icon={<Image />} iconPosition="start" />
          </Tabs>
        </Box>
      </Card>
      <Box>
        <TabPanel value={tab} index={0} keepMounted>
          <UserEdit />
        </TabPanel>
        <TabPanel value={tab} index={1} keepMounted>
          <Subscription />
        </TabPanel>
        <TabPanel value={tab} index={2} keepMounted>
          <AddressForm />
        </TabPanel>
        <TabPanel value={tab} index={3}>
          <Orders />
        </TabPanel>
        <TabPanel value={tab} index={4} keepMounted>
          <Gallery userId={user?.userId} onData={onGalleryData} />
        </TabPanel>
      </Box>
    </Container>
  )
}

export default Profile
