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

export function getNotebookPathFromUUID(uuid){
    return getNotebookPath({uuid: uuid})
}

export function isFunction(functionToCheck) {
    var getType = {}
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]'
}
