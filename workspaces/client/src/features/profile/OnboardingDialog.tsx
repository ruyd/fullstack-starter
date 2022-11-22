/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Button, DialogActions, DialogContent, Fade, Grow, Slide } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import { TransitionProps } from '@mui/material/transitions'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { patch } from '../app'
import Login from './Login'
import Register from './Register'
import { GoogleOneTapButton } from './GoogleOneTap'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function OnboardingDialog() {
  const dispatch = useAppDispatch()
  const requested = useAppSelector(state => state.app.dialog)
  const [show, setShow] = React.useState('login')
  const open = requested?.includes('onboard')
  const handleClose = React.useCallback(() => {
    dispatch(patch({ dialog: undefined }))
  }, [dispatch])

  React.useEffect(() => {
    setShow(requested?.split('.')[1] || 'login')
  }, [requested, setShow])

  if (!open) {
    return null
  }

  return (
    <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
      <DialogContent>
        <Login sx={show === 'login' ? {} : { display: 'none' }} />
        <Grow in={show === 'register'}>
          <div>
            <Register sx={show === 'register' ? {} : { display: 'none' }} />
          </div>
        </Grow>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <GoogleOneTapButton style={{ marginBottom: '-5px' }} />
          <Button onClick={() => setShow('login')}>Login</Button>
          <Button onClick={() => setShow('register')}>Register</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}