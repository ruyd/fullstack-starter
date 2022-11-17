import React from 'react'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import config from '../../shared/config'

type OneTapBase = {
  context?: 'use' | 'signin' | 'signup'
  callback?: (response: { credential?: string }) => void
}

const initOptions: OneTapParams = {
  client_id: config.auth?.google?.clientId,
  callback: () => {
    /* response.credential should be enough for google cloud backends,
    using Callback.tsx for auth0 */
  },
}

export interface OneTapParams extends OneTapBase {
  client_id?: string
  auto_select?: boolean
  cancel_on_tap_outside?: boolean
}
export type OneTapAPI = {
  accounts: { id: { initialize: (options: OneTapParams) => void; prompt: () => void } }
}
export type WindowWithGoogle = Window & typeof globalThis & { google: OneTapAPI }

export interface OneTapHookOptions extends OneTapBase {
  clientId?: string
  autoSelect?: boolean
  cancelOnTapOutside?: boolean
  ref?: React.MutableRefObject<OneTapAPI | null>
}

export function loadScriptAndInit({
  clientId,
  autoSelect = false,
  cancelOnTapOutside = true,
  context = 'signin',
  callback,
  ref,
  ...otherOptions
}: OneTapHookOptions): void {
  if (typeof window !== 'undefined' && window.document) {
    const contextValue = ['signin', 'signup', 'use'].includes(context) ? context : 'signin'
    const googleScript = document.createElement('script')
    googleScript.src = 'https://accounts.google.com/gsi/client'
    googleScript.async = true
    googleScript.defer = true
    document.head.appendChild(googleScript)

    window.onload = function () {
      const google = (window as WindowWithGoogle).google
      if (google) {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: callback,
          auto_select: autoSelect,
          cancel_on_tap_outside: cancelOnTapOutside,
          context: contextValue,
          ...otherOptions,
        })
        google.accounts.id.prompt()
        if (ref) {
          ref.current = google
        }
      }
    }
  }
}

export const prompt = () => {
  const tap = (window as WindowWithGoogle).google?.accounts?.id
  tap.initialize(initOptions)
  tap.prompt()
}

export function GoogleOneTap(): JSX.Element {
  const dispatch = useAppDispatch()
  const loaded = React.useRef(false)
  const ref = React.useRef<OneTapAPI | null>(null)
  const token = useAppSelector(state => state.app.token)

  React.useEffect(() => {
    if (!loaded.current && !token) {
      loadScriptAndInit({
        ...initOptions,
        ref,
      })
      loaded.current = true
    }
  }, [dispatch, loaded, token])

  return <></>
}

export default GoogleOneTap
