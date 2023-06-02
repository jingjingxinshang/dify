'use client'
import React from 'react'
import s from './style.module.css'
import TTSRecorder from './TTS.js'
import Tooltip from '@/app/components/base/tooltip'
type ITtsBtnProps = {
  value: string
  className?: string
}

const TtsBtn = ({ value, className }: ITtsBtnProps) => {
  const ttsRecorder = new TTSRecorder()
  return (
    <div className={`${className}`}>
      <Tooltip
        selector="copy-btn-tooltip"
        content={'播放'}
        className="z-10"
      >
        <div
          className="box-border p-0.5 flex items-center justify-center rounded-md bg-white cursor-pointer"
          style={{
            boxShadow:
              '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
          }}
          onClick={() => {
            ttsRecorder.setParams({
              text: value,
            } as any)
            if (ttsRecorder.status === 'play') {
              ttsRecorder.stop()
              ttsRecorder.ttsWS.close()
            }
            else {
              if (['init', 'endPlay', 'errorTTS'].includes(ttsRecorder.status))
                ttsRecorder.start()

              else
                ttsRecorder.stop()
            }
          }}
        >
          <div className={`w-6 h-6 hover:bg-gray-50  ${s.copyIcon} `}></div>
        </div>
      </Tooltip>
    </div>
  )
}

export default TtsBtn
