enum Colors {
  Reset = '\x1b[0m',
  Bright = '\x1b[1m',
  Dim = '\x1b[2m',
  Underscore = '\x1b[4m',
  Blink = '\x1b[5m',
  Reverse = '\x1b[7m',
  Hidden = '\x1b[8m',

  TextBlack = '\x1b[30m',
  TextRed = '\x1b[31m',
  TextGreen = '\x1b[32m',
  TextYellow = '\x1b[33m',
  TextBlue = '\x1b[34m',
  TextMagenta = '\x1b[35m',
  TextCyan = '\x1b[36m',
  TextWhite = '\x1b[37m',

  BgBlack = '\x1b[40m',
  BgRed = '\x1b[41m',
  BgGreen = '\x1b[42m',
  BgYellow = '\x1b[43m',
  BgBlue = '\x1b[44m',
  BgMagenta = '\x1b[45m',
  BgCyan = '\x1b[46m',
  BgWhite = '\x1b[47m'
}

export default Colors