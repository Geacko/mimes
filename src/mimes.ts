/**
 *  Metadatas associated with a
 *  specific MIME
 */
export interface MimeMetadata {
    
    /** the MIME type */
    get type(): string

    /** Is compressible or not */
    get isCompressible(): boolean

    /** Is UTF-8 or not */
    get isUtf8(): boolean

    /** The `Content-Type` header */
    get contentType(): string

}

/** @internal */
const mimeToExtMap = new Map<string, readonly string[]>();

/** @internal */
const extToMimeMap = new Map<string, MimeMetadata>();

// Fetch mimetype metadatas
const db = await (await fetch(`https://cdn.jsdelivr.net/gh/jshttp/mime-db@master/db.json`)).json() as Record<string, Partial<{
    source: string, compressible: boolean, extensions: string[], charset: string
}>>

// Hydrate maps
Object.keys(db).forEach((t) => {

    const {
        extensions, compressible, charset
    } = db[t]!

    if (
        extensions &&
        extensions.length != 0
    ) {

        mimeToExtMap.set(t, Object.freeze(extensions));

        const m = Object.freeze({
            isUtf8: charset == 'UTF-8', 
            isCompressible: compressible == true, 
            type: t,
            contentType : t + (charset == 'UTF-8' ? '; charset=UTF-8' : '')
        })

        for (const e of extensions) {
            extToMimeMap.set(e, m)
        }

    }

})

/**
 *  Returns possible extensions associated
 *  with the MIME type `mimetype`
 */
export function extensionsFromMimetype(
    mimetype: string
) : readonly string[] | undefined {

    return mimeToExtMap.get(mimetype)

}

/**
 *  Returns MIME informations associated with
 *  the path or the extension (prefixed with ".")
 */
export function lookup(
    pathOrExt: string
) : MimeMetadata | undefined {

    const i = pathOrExt.lastIndexOf('.')

    if (i == -1) {
        return void 0
    }

    return extToMimeMap.get(
        pathOrExt.substring(i + 1)
    )

}
