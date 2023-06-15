'use client'
import React from 'react'
import { t } from 'i18next'
import { useContext } from 'use-context-selector'
import s from './style.module.css'
import TTSRecorder from './TTS.js'
import { ToastContext } from '@/app/components/base/toast'
import Tooltip from '@/app/components/base/tooltip'
type ITtsBtnProps = {
  value: string
  className?: string
}
const ttsRecorder = new TTSRecorder()

const TtsBtn = ({ value, className }: ITtsBtnProps) => {
  const { notify } = useContext(ToastContext)
  const [status, setStatus] = React.useState('init')
  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }
  const logSucc = (message: string) => {
    notify({ type: 'success', message, duration: 3000 })
  }
  const handleTts = () => {
    console.log(status, ttsRecorder.status)
    // if (query !== value) {
    //   setQuery(value)
    //   ttsRecorder.stop()
    //   setStatus('init')
    // }
    ttsRecorder.setParams({
      text: value,
    } as any)
    if (['init', 'endPlay', 'errorTTS', 'ttsing'].includes(status)) {
      ttsRecorder.start()
      console.log('start')
    }
    else {
      ttsRecorder.stop()
      setStatus('init')
      console.log('stop')
    }

    ttsRecorder.onWillStatusChange = (oldStatus, status) => {
      setStatus(status)
    }
  }
  return (
    <div className={`${className}`}>
      <Tooltip
        selector="tts-btn-tooltip"
        content={t('appApi.ttsPlay') as string}
        className="z-10"
      >
        <div
          className="box-border p-0.5 flex items-center justify-center rounded-md bg-white cursor-pointer"
          style={{
            boxShadow:
              '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
          }}
          onClick={handleTts}
        >
          <div className={`w-6 h-6 hover:bg-gray-50  ${s.copyIcon} `}></div>
        </div>
      </Tooltip>
    </div>
  )
}

export default TtsBtn
