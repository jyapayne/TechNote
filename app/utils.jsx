import path from 'path-extra'
import uuid from 'node-uuid'

import * as utils from 'utils'
import glob from 'glob'

import fs from 'fs'
import mkdirp from 'mkdirp'
import jsfile from 'jsonfile'
import rmdir from 'rimraf'

var APP_NAME = 'TechNote'

export function getAppDataPath(){
    return path.datadir(APP_NAME)
}

export function getNotePath(notebook, note){
    var notePath = getAppDataPath()
    var notebookPath = getNotebookPath(notebook)
    return path.join(notebookPath, note.uuid+'.qvnote')
}

export function getNotebookPath(notebook){
    var noteBookPath = getAppDataPath()
    return path.join(noteBookPath, notebook.uuid+'.qvnotebook')
}

export function createNotebookDir(notebookNameOrUUID){
    var dataPath = getAppDataPath()
    var notebookPath = path.join(dataPath, notebookNameOrUUID+'.qvnotebook')

    mkdirp.sync(notebookPath)
}

export function isEmpty(obj){
    return Object.keys(obj).length === 0 && JSON.stringify(obj) === JSON.stringify({})
}

export function differs(obj, otherobj){
    var objKeys = Object.keys(obj)
    var otherKeys = Object.keys(otherobj)
    objKeys.sort()
    otherKeys.sort()

    if(objKeys.length != otherKeys.length){
        return true
    }
    for(var i=0; i<objKeys.length; i++){
        var objField = objKeys[i]
        var otherField = otherKeys[i]
        if(objField != otherField){
            return true
        }
        var objVal = obj[objField]
        var otherVal = otherobj[otherField]
        if (objVal != otherVal){
            return true
        }
    }
    return false
}

export function loadNote(notePath){
    var metaPath = path.join(notePath, 'meta.json')
    var contentPath = path.join(notePath, 'content.json')

    var meta = jsfile.readFileSync(metaPath)
    var content = jsfile.readFileSync(contentPath)

    var note = meta

    note.summary = ''
    note.path = notePath

    if(content.cells.length > 0){
        note.summary = content.cells[0].data
    }

    return note
}

export function loadNoteAsync(notePath, callback){
    var metaPath = path.join(notePath, 'meta.json')
    var contentPath = path.join(notePath, 'content.json')

    var meta = jsfile.readFileSync(metaPath)
    var content = jsfile.readFileSync(contentPath)

    jsfile.readFile(metaPath, (err, meta) => {
        jsfile.readFile(contentPath, (err, content) => {
            if(isFunction(callback)){
                var note = meta

                note.summary = ''
                note.path = notePath

                if(content.cells.length > 0){
                    note.summary = content.cells[0].data
                }
                callback(note)
            }
        })
    })
}

export function loadNotesAsync(notebook, callback){
    var notebookPath = getNotebookPath(notebook)
    var dataPath = getAppDataPath()
    var noteGlob = ''

    if(notebook.glob){
        noteGlob = path.join(dataPath, notebook.glob)
    }
    else{
        noteGlob = path.join(notebookPath, '*.qvnote')
    }
    var notes = []

    glob(noteGlob, (err, notePaths) => {
        for(var i=0; i<notePaths.length; i++){
            var notePath = notePaths[i]
            loadNoteAsync(notePath, (note) => {
                note.notebook = notebook
                notes.push(note)
                if (notes.length == notePaths.length){
                    if(isFunction(callback)){
                        if (notebook.filter){
                            notes = notebook.filter(notes)
                        }
                        callback(notes)
                    }
                }
            })
        }
    })
}

export function loadNotes(notebook){
    var notebookPath = getNotebookPath(notebook)
    var dataPath = getAppDataPath()
    var noteGlob = ''

    if(notebook.glob){
        noteGlob = path.join(dataPath, notebook.glob)
    }
    else{
        noteGlob = path.join(notebookPath, '*.qvnote')
    }

    var notePaths = glob.sync(noteGlob)

    var notes = []

    for(var i=0; i<notePaths.length; i++){
        var notePath = notePaths[i]
        var note = loadNote(notePath)
        note.notebook = notebook
        notes.push(note)
    }

    if(notebook.filter){
        notes = notebook.filter(notes)
    }

    return notes
}

export function loadNotebookByName(nameOrUUID){
    var dataPath = getAppDataPath()
    var notebookPath = path.join(dataPath, nameOrUUID+'.qvnotebook')
    var obj = jsfile.readFileSync(path.join(notebookPath, 'meta.json'))
    var notes = glob.sync(path.join(notebookPath, '*.qvnote'))

    var nb = {
        'title': obj.name,
        'uuid': obj.uuid,
        'notes': notes.length,
        'path': notebookPath
    }

    if(nb.title == ''){
        nb.state = 'editing'
    }
    else{
        nb.state = 'displaying'
    }
    return nb
}

export function updateObject(old, newObj){
    for (var key in newObj) {
        old[key] = newObj[key];
    }
    return old
}

export function getNotePathFromUUID(notebook, uuid){
    return getNotePath(notebook, {uuid: uuid})
}

export function getNotebookPathFromUUID(uuid){
    return getNotebookPath({uuid: uuid})
}

export function isFunction(functionToCheck) {
    var getType = {}
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]'
}

export function trunc(str, n){
    return (str.length > n) ? str.substr(0, n-1)+'...' : str;
};

export function compareNotebooks(a, b) {
    let atitle = a.title.toLowerCase()
    let btitle = b.title.toLowerCase()

    if(atitle > btitle)
        return 1
    if(atitle < btitle)
        return -1
    return 0
}

export function dateDesc(a, b){
    return b.created_at - a.created_at
}

export function dateAsc(a, b){
    return a.created_at - b.created_at
}

export function titleAsc(a, b){
    let atitle = a.title.toLowerCase()
    let btitle = b.title.toLowerCase()

    if(atitle > btitle)
        return 1
    if(atitle < btitle)
        return -1
    return 0
}

export function titleDesc(a, b){
    let atitle = a.title.toLowerCase()
    let btitle = b.title.toLowerCase()

    if(atitle < btitle)
        return 1
    if(atitle > btitle)
        return -1
    return 0
}

const defaultOrder = [
    dateDesc,
    titleAsc
]

export function compareNotes(ordering = defaultOrder) {
    return (a, b) => {
        for(var i=0; i<ordering.length; i++){
            var order = ordering[i]
            var res = order(a, b)
            if(res != 0){
                return res
            }
        }
    }
}
