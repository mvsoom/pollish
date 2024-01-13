$(document).ready(function () {
  let textEdit = $('#textEdit')

  textEdit.on('keydown', function (e) {
    if (e.ctrlKey && e.key === '.') {
      textArea = textEdit[0]
      text = getTextUntilCursor(textArea)

      /*
       * Prevent default browser behavior for this key combination
       * and manually insert a dot. If the cursor is already at a dot,
       * simply repolish the sentence.
       */
      e.preventDefault()
      if (text[text.length - 1] !== '.') {
        text += '.'
        appendDot(textArea)
      }

      invokePolisher(text, textArea)
    }
  })
})

function getTextUntilCursor(textArea) {
  let cursorPosition = textArea.selectionStart
  return textArea.value.substring(0, cursorPosition)
}

function appendDot(textArea) {
  let cursorPosition = textArea.selectionStart
  textArea.setRangeText('.', cursorPosition, cursorPosition, 'end')
}

function hash(text) {
  /* Simple hash function for strings */
  return Array.from(text).reduce(
    (hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0,
    0
  )
}

function invokePolisher(text, textArea) {
  console.log(text)

  /* Assert that the last character is a dot */
  if (text[text.length - 1] !== '.') {
    return
  }

  let state = hash(text)

  let sentences = text.split('.')
  sentences.pop() // Remove the last element, which is always an empty string
  let lastSentence = sentences.pop() + '.'

  /* Restore a leading space later if present */
  let leadingWhitespace = lastSentence[0] === ' '
  trimmedLastSentence = lastSentence.trim()

  console.log(sentences)
  console.log(lastSentence)
  console.log(state)
  console.log(leadingWhitespace)

  fetch('/polish_sentence', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sentence: trimmedLastSentence })
  })
    .then(response => response.json())
    .then(data => {
      console.log(data.polished_sentence)

      /* Ensure nothing has changed up until the last sentence... */
      textNow = textArea.value
      let stateNow = hash(textNow.substring(0, text.length))
      if (stateNow !== state) {
        console.log('Changed state: nothing replaced')
        return
      }

      /* ... so that we can safely replace the last sentence. */
      let polishedSentence =
        (leadingWhitespace ? ' ' : '') + data.polished_sentence
      let from = text.length - lastSentence.length
      let to = text.length
      textArea.setRangeText(
        polishedSentence,
        from,
        to,
        text.length === textNow.length ? 'end' : 'preserve'
      )
    })
    .catch(error => {
      console.error('Error:', error)
    })
}
