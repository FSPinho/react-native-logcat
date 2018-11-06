const Args = require('./args')

const COLORS = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m", // Bolder
    Dim: "\x1b[2m", // Medium
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",
    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",
    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m"
}

const LEVELS = {
    V: {color: COLORS.Reset, regex: /\d+\s+V\s+/}, // Verbose (lowest priority)
    D: {color: COLORS.Bright, regex: /\d+\s+D\s+/},  // Debug
    I: {color: COLORS.FgBlue, regex: /\d+\s+I\s+/},  // Info
    W: {color: COLORS.FgYellow, regex: /\d+\s+W\s+/},  // Warning
    E: {color: COLORS.FgRed, regex: /\d+\s+E\s+/},  // Error
    F: {color: COLORS.FgMagenta, regex: /\d+\s+F\s+/},  // Fatal
    S: {color: COLORS.FgGreen, regex: /\d+\s+S\s+/},  // Silent (highest priority, on which nothing is ever printed)
}

const _applyFilter = (p, filters) => {
    return (
        !typeof filters.length
        || (typeof filters === 'string' && new RegExp(filters).test(p))
        || (typeof filters.filter !== 'undefined' && filters.filter(f => new RegExp(f).test(p)).length > 0)
    )
}

const _applyPriorities = (p, priorities) => {
    return (
        !typeof priorities.length
        || (typeof priorities === 'string' && LEVELS[priorities].regex.test(p))
        || (typeof priorities.filter !== 'undefined' && priorities.filter(pr => new RegExp(LEVELS[pr].regex).test(p)).length > 0)
    )
}

exports.log = (msg) => {

    const args = Args.getArgs()
    const filters = args['-f'] || []
    const priorities = args['-p'] || []

    const rn = args['-rn']
    if(rn) {
        filters.push('ReactNative')
        filters.push('ReactNativeJS')
    }

    const parts = msg.split('\n')
    parts.map(p => {
        if (_applyFilter(p, filters) || _applyPriorities(p, priorities)) {
            const level = Object.keys(LEVELS).map(k => LEVELS[k]).filter(l => l.regex.test(p))[0]
            if (level)
                console.log(`${level.color} ${p} ${COLORS.Reset}`)
            else
                console.log('--')
        }
    })
}