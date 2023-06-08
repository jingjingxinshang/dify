'use client'
import React from 'react'
import { t } from 'i18next'
import s from './style.module.css'
import TTSRecorder from './TTS.js'
import Tooltip from '@/app/components/base/tooltip'
type ITtsBtnProps = {
  value: string
  className?: string
}

const TtsBtn = ({ value, className }: ITtsBtnProps) => {
  const ttsRecorder = new TTSRecorder()
  const [status, setStatus] = React.useState('')
  const [query, setQuery] = React.useState('')
  const handleTts = () => {
    setStatus(ttsRecorder.status)
    setQuery(ttsRecorder.text)
    if (query === value && status === 'play') {
      ttsRecorder.stop()
      return
    }
    ttsRecorder.setParams({
      text: value,
    } as any)

    if (['init', 'endPlay', 'errorTTS'].includes(status))
      ttsRecorder.start()
    else if (status === 'play')
      ttsRecorder.stop()
    // ttsRecorder.onWillStatusChange = (os, s) => {
    //   console.log(os, s)
    //   // setStatus(s)
    // }
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
