# Mime Lookup

## Example 1

fetch MIME informations about `js`

````ts
import * as Mime from 'jsr:@geacko/deno-mimetypes'

const {
    type,
    isCompressible,
    isUtf8
} = Mime.lookup(`js`)!

console.log(`Content-Type: ${type}${isUtf8 ? `; charset=UTF-8` : ``}`)

if (isCompressible) {
    console.log(`Content-Encoding: gzip`)
}

// output: 
// "Content-Type: text/javascript; charset=UTF-8"
// "Content-Encoding: gzip"

````

## Example 2

fetch extensions associated with `text/javascript`

````ts
import * as Mime from 'jsr:@geacko/deno-mimetypes'

const extensions 
    = Mime.extensionsFromMimetype(`text/javascript`) ?? []

for (const ext of [`txt`, `js`, `css`]) {
    console.log(ext + ` > ` + extensions.includes(ext))
}

// output:
// "txt > false"
// "js > true"
// "css > false"

````