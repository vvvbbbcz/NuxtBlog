/**
 * Modified from {@link https://github.com/antfu/markdown-it-async/blob/main/src/index.ts}
 * 
 * @author Anthony Fu
 * @license MIT
 */

import type { Options, PresetName } from 'markdown-it'
import MarkdownIt from 'markdown-it'

export type PluginSimple = ((md: MarkdownItAsync) => void)
export type PluginWithOptions<T = any> = ((md: MarkdownItAsync, options?: T) => void)
export type PluginWithParams = ((md: MarkdownItAsync, ...params: any[]) => void)

export interface AsyncOptions extends Omit<Options, 'highlight'> {
    /**
     * Highlighter function for fenced code blocks.
     * Highlighter `function (str, lang, attrs)` should return escaped HTML. It can
     * also return empty string if the source was not changed and should be escaped
     * externally. If result starts with <pre... internal wrapper is skipped.
     * @default null
     */
    highlight?: ((str: string, lang: string, attrs: string) => string | Promise<string>) | null | undefined

    /**
     * Emit warning when calling `md.render` instead of `md.renderAsync`.
     *
     * @default false
     */
    warnOnSyncRender?: boolean
}

export type { AsyncOptions as Options }

const placeholder = (id: number, code: string): string => `<pre><!--::markdown-it-async::${id}::--><code>${code}</code></pre>`
const placeholderRe = /<pre><!--::markdown-it-async::(\w+)::--><code>[\s\S]*?<\/code><\/pre>/g

export type AsyncTasks = Promise<string>[]

export class MarkdownItAsync extends MarkdownIt {
    asyncTasks: AsyncTasks

    constructor(presetName: PresetName, options?: AsyncOptions)
    constructor(options?: AsyncOptions)
    constructor(...args: any[]) {
        const tasks: AsyncTasks = []
        const options: AsyncOptions | undefined = args.length === 2 ? args[1] : args[0]

        if (options && 'highlight' in options) {
            options.highlight = wrapHighlight(options.highlight, tasks)
        }

        super(...args as [])
        this.asyncTasks = tasks
    }

    async renderAsync(src: string, env?: any): Promise<string> {
        const result = this.render(src, env)
        const res = await replaceAsync(result, placeholderRe, async (_match, id) => {
            const task = this.asyncTasks[parseInt(id)]
            if (task === undefined) throw new Error(`Unknown highlight placeholder id: ${id}`)

            const promise = task
            const result = await promise || ''
            return result
        })
        this.asyncTasks.length = 0;
        return res
    }
}

/**
 * Modified from {@link https://github.com/dsblv/string-replace-async/blob/main/index.js}
 * @param string The string to be replaced
 * @param searchValue A regular expression for searching
 * @param replacer The function to replace matched substring
 * @returns The new string
 * 
 * @author Dima Sobolev
 * @license MIT
 */
async function replaceAsync(string: string, searchValue: RegExp, replacer: (...args: string[]) => Promise<string>) {
    try {
        if (typeof replacer === 'function') {
            const values: Promise<string>[] = []
            String.prototype.replace.call(string, searchValue, (...args) => {
                values.push(replacer(...args))
                return ''
            })
            const resolvedValues = await Promise.all(values)
            return String.prototype.replace.call(string, searchValue, () => {
                return resolvedValues.shift() || ''
            })
        } else {
            return Promise.resolve(
                String.prototype.replace.call(string, searchValue, replacer),
            )
        }
    } catch (error) {
        return Promise.reject(error)
    }
}

function wrapHighlight(highlight: AsyncOptions['highlight'], tasks: AsyncTasks): Options['highlight'] {
    if (!highlight) return undefined;

    const wrapped: Options['highlight'] = (code, lang, attrs) => {
        code = code.trim();

        const promise = highlight(code, lang, attrs)
        if (typeof promise === 'string') return promise

        const id = tasks.length
        tasks.push(promise)

        return placeholder(id, escapeHtml(code))
    }

    return wrapped
}

function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}
