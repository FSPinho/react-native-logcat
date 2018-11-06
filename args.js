exports.getArgs = () => {
    const args = {}
    process.argv.map(arg => {
        if (/=/.test(arg)) {
            const [k, a] = arg.split("=")
            if (args[k]) {
                if (typeof args[k] === 'string') {
                    args[k] = [args[k], a]
                } else {
                    args[k] = [...args[k], a]
                }
            } else {
                args[k] = [a]
            }
        } else {
            args[arg] = true
        }
    })
    return args
}