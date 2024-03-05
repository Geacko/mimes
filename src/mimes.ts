/**
 *  Metadatas associated with a
 *  specific MIME
 */
export type MimeMetadata = {
    
    /** the MIME type */
    readonly type: string

    /** Is compressible or not */
    readonly isCompressible: boolean

    /** Is UTF-8 or not */
    readonly isUtf8: boolean

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
            type: t
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
 *  the extension `ext`
 */
export function lookup(
    ext: string
) : MimeMetadata | undefined {

    if (ext.startsWith(`.`)) {
        ext = ext.substring(1)
    }

    return extToMimeMap.get(ext)

}
