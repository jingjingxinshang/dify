const minSampleRate = 22050

const transcode = {
  transToAudioData(audioDataStr, fromRate = 16000, toRate = 22505) {
    const outputS16 = transcode.base64ToS16(audioDataStr)
    let output = transcode.transS16ToF32(outputS16)
    output = transcode.transSamplingRate(output, fromRate, toRate)
    output = Array.from(output)
    self.postMessage({
      data: output,
      rawAudioData: Array.from(outputS16),
    })
  },
  transSamplingRate(data, fromRate = 44100, toRate = 16000) {
    const fitCount = Math.round(data.length * (toRate / fromRate))
    const newData = new Float32Array(fitCount)
    const springFactor = (data.length - 1) / (fitCount - 1)
    newData[0] = data[0]
    for (let i = 1; i < fitCount - 1; i++) {
      const tmp = i * springFactor
      const before = Math.floor(tmp).toFixed()
      const after = Math.ceil(tmp).toFixed()
      const atPoint = tmp - before
      newData[i] = data[before] + (data[after] - data[before]) * atPoint
    }
    newData[fitCount - 1] = data[data.length - 1]
    return newData
  },
  transS16ToF32(input) {
    const tmpData = []
    for (let i = 0; i < input.length; i++) {
      const d = input[i] < 0 ? input[i] / 0x8000 : input[i] / 0x7FFF
      tmpData.push(d)
    }
    return new Float32Array(tmpData)
  },
  base64ToS16(base64AudioData) {
    base64AudioData = atob(base64AudioData)
    const outputArray = new Uint8Array(base64AudioData.length)
    for (let i = 0; i < base64AudioData.length; ++i)
      outputArray[i] = base64AudioData.charCodeAt(i)

    return new Int16Array(new DataView(outputArray.buffer).buffer)
  },
}
self.onmessage = function (e) {
  transcode.transToAudioData(e.data)
}
