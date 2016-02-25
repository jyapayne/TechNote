import path from 'path-extra'

export function getAppDataPath(){
    return path.datadir(APP_NAME)
}

export function getNotebookPath(notebook){
    var notePath = getAppDataPath()
    return path.join(notePath, notebook.uuid+'.qvnotebook')
}
