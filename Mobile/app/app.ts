import { Application } from '@nativescript/core'
// Polyfills for Node globals used by some deps (@nativescript/tailwind -> postcss -> util)
import process from 'process/browser'
import { Buffer } from 'buffer'

;(globalThis as any).process = (globalThis as any).process || process
;(globalThis as any).process.env = (globalThis as any).process.env || {}
;(globalThis as any).Buffer = (globalThis as any).Buffer || Buffer

// Require tailwind after globals are set (supports various export shapes)
const tw = require('@nativescript/tailwind')
if (typeof tw === 'function') {
	tw()
} else if (tw && typeof tw.install === 'function') {
	tw.install()
} else if (tw && tw.default && typeof tw.default === 'function') {
	tw.default()
}

Application.run({ moduleName: 'app-root' })

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
