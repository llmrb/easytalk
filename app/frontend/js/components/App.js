/* global HTMLImageElement */

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

import {
  AssistantMessage,
  StreamingMessage,
  SystemMessage,
  UserMessage
} from '~/js/components/Messages'

import { ModelSelect, ProviderSelect } from '~/js/components/Select'
import { useModels, useWebSocket } from '~/js/hooks'

export default function App () {
  const [cost, setCost] = useState('')
  const [message, setMessage] = useState('')
  const [provider, setProvider] = useState('deepseek')
  const { loading: modelsLoading, model, models, setModel } = useModels(provider)
  const { entries, send, status, streaming } = useWebSocket(provider, model, setModel, setCost)
  const streamRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    const stream = streamRef.current
    if (stream) stream.scrollTop = stream.scrollHeight
  }

  useLayoutEffect(() => {
    scrollToBottom()
  }, [entries, streaming])

  useEffect(() => {
    const stream = streamRef.current
    if (!stream) return
    const onLoad = (event) => {
      if (event.target instanceof HTMLImageElement) scrollToBottom()
    }
    stream.addEventListener('load', onLoad, true)
    return () => stream.removeEventListener('load', onLoad, true)
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const onSubmit = (event) => {
    event.preventDefault()
    if (!message) return
    if (send(message)) setMessage('')
  }

  const onProviderChange = (event) => {
    setProvider(event.target.value)
  }

  return (
    <main className='h-screen bg-white font-sans text-zinc-900'>
      <div className='mx-auto flex h-full min-h-0 w-full max-w-none gap-4 px-4 py-6 sm:px-6'>
        <aside className='hidden shrink-0 lg:flex lg:w-56 lg:flex-col lg:items-center lg:gap-4 lg:pt-2'>
          <a target='_blank' rel='noopener noreferrer' href='https://www.youtube.com/watch?v=CyzdOtyYnng'>
            <img
              className='max-h-16 w-auto max-w-[11rem] rounded-2xl'
              src='/images/realtalk.png'
              alt='RealTalk'
            />
          </a>
          <div className='flex w-full flex-col gap-3 text-sm text-zinc-500'>
            <ProviderSelect provider={provider} onChange={onProviderChange} />
            <ModelSelect
              loading={modelsLoading}
              model={model}
              models={models}
              onChange={(event) => setModel(event.target.value)}
            />
            <span className='text-center text-xs text-zinc-400'>
              {modelsLoading ? '...' : `${models.length} models`}
            </span>
            <div className='rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center'>
              <p className='text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700'>
                Session Cost
              </p>
              <p className='mt-1 text-2xl font-semibold text-emerald-950'>
                {cost || '$0.00'}
              </p>
            </div>
          </div>
        </aside>
        <div className='flex min-h-0 min-w-0 flex-1 flex-col gap-4'>
        <div
          id='stream'
          ref={streamRef}
          className='min-h-0 flex-1 overflow-y-auto rounded-3xl border border-zinc-200 bg-zinc-50 p-4 text-[15px] leading-7 shadow-sm'
        >
          {entries.map((entry, index) => {
            if (entry.kind === 'assistant') { return <AssistantMessage key={index} markdown={entry.markdown} /> }
            if (entry.kind === 'user') { return <UserMessage key={index} text={entry.text} /> }
            return <SystemMessage key={index} text={entry.text} />
          })}
          {streaming ? <StreamingMessage markdown={streaming} /> : null}
        </div>
        <p className='text-left text-sm text-zinc-500'>
          Status: <span className='font-semibold text-zinc-700'>{status}</span>
        </p>
        <form
          className='sticky bottom-0 flex flex-col gap-2 bg-gradient-to-b from-white/0 via-white/90 to-white pt-3 pb-1'
          onSubmit={onSubmit}
        >
          <input
            ref={inputRef}
            className='h-13 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-[15px] text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/10'
            type='text'
            placeholder='Type a message'
            autoComplete='off'
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <div className='flex justify-end'>
            <button
              className='min-w-24 rounded-full bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:ring-4 focus:ring-zinc-900/10 focus:outline-none'
              type='submit'
            >
              Send
            </button>
          </div>
        </form>
        </div>
      </div>
    </main>
  )
}
