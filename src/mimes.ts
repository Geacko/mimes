// Copyright 2024 Grégoire Jacquot <gregoirejacquot@outlook.com>. All rights reserved. MIT license.

/**
 *  Metadatas associated with a
 *  specific MIME
 */
export type MimeMetadata = Readonly<{
    
    /** 
     * the MIME type 
     * @readonly
     * */
    type: string

    /** 
     * Is compressible or not 
     * @readonly
     * */
    isCompressible: boolean

    /** 
     * Is UTF-8 or not 
     * @readonly
     * */
    isUtf8: boolean

    /** 
     * The `Content-Type` header 
     * @readonly
     * */
    contentType: string

}>

const db = await (await fetch(`https://cdn.jsdelivr.net/gh/jshttp/mime-db@master/db.json`)).json() as Record<string, Partial<{

    source       : string 
    compressible : boolean
    extensions   : Array<string> 
    charset      : string

}>>

const mimeToExt = new Map<string, Readonly<Array<string>>>()
const extToMime = new Map<string, MimeMetadata>()

Object.keys(db).forEach(type => {

    const {
        extensions, compressible, charset
    } = db[type]!

    if (
        extensions &&
        extensions.length != 0
    ) {

        mimeToExt.set(type, Object.freeze(extensions))

        const isUtf8 
            = charset == 'UTF-8'

        const contentType 
            = isUtf8 
            ? type + '; charset=UTF-8' 
            : type

        const m = Object.freeze({
            type, contentType, isUtf8, isCompressible: compressible == true
        })

        for (const e of extensions) {
            extToMime.set(e, m)
        }

    }

})


/**
 *  Returns extensions associated with 
 *  the MIME type
 */
export function extensionsFromMimetype(
    mimetype: string
) : readonly string[] | undefined {

    return mimeToExt.get(mimetype)

}

/**
 *  Returns MIME informations associated with
 *  the path or the extension (prefixed with ".")
 */
export function lookup(
    pathOrExt: string
) : MimeMetadata | undefined {

    const i = pathOrExt.lastIndexOf('.')

    return i >= 0 
         ? extToMime.get(pathOrExt.substring(i + 1)) 
         : undefined

}
