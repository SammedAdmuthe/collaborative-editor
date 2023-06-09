
"use strict"
window.onload = function () {
    let socket;
    const documentId = new URL(window.location.href).pathname.split('/')[1] || 'test';

    const handle = document.getElementById('handle');
    const register = document.getElementById('register');
    const registrationFormDiv = document.getElementById('registrationFormDiv');

    const editor = CKEDITOR.instances.textarea;

    let syncValue = Array();
    let keypressed = false;

    function removeElement(id) {
        var elem = document.getElementById(id);
        return elem.parentNode.removeChild(elem);
    }
    function applyLocalChanges() {
        if (keypressed && editor.checkDirty()) {
            let currentData = editor.getData();
            let input = Array.from(syncValue);
            let output = Array.from(currentData);
            let changes = getChanges(input, output);
            applyChanges(input, changes);
            if (output.join('') == input.join('')) {
                socket.emit('content_change', {
                    documentId: documentId,
                    changes: changes
                });
                editor.resetDirty();
                syncValue = input;
            }
            keypressed = false;
        }
    }
    function setSocketEvents() {
        socket.on('content_change', (incomingChanges) => {

            let input = Array.from(syncValue);
            socket.emit('clientSideChanges', {
            	changes: incomingChanges
            });
	    console.log("At client Side : "+ incomingChanges);
            applyChanges(input, incomingChanges);
            syncValue = input;
            applyLocalChanges();

            let ranges = editor.getSelection().getRanges();
            editor.setData(syncValue.join(''));
            editor.getSelection().selectRanges(ranges);
            editor.resetDirty();
        });
        socket.on('register', (data) => {

        });

        socket.on('user_left', (data) => {
            removeElement(data.id);
        });
        socket.on('members', (members) => {
            members.forEach(member => {

            });
            socket.off('members');
        });
    }

    function registerUserListener() {
        handle.style.display = 'none';
        register.style.display = 'none';
        registrationFormDiv.style.display = 'none';

        const editorBlock = document.getElementById('editor-block');
        editorBlock.style.display = 'block';
        syncValue = "";
        socket = io();
        socket.emit('register', {
            handle: handle.value,
            documentId: documentId
        });
        setSocketEvents();
    }

    function getChanges(input, output) {
        return diffToChanges(diff(input, output), output);
    }

    function applyChanges(input, changes) {
        changes.forEach(change => {
            if (change.type == 'insert') {
                input.splice(change.index, 0, ...change.values);
            } else if (change.type == 'delete') {
                input.splice(change.index, change.howMany);
            }
        });
    }

    var timeout = setTimeout(null, 0);
    editor.on('key', () => {
        clearTimeout(timeout);
        keypressed = true;
        timeout = setTimeout(applyLocalChanges, 1000);
    });

    register.addEventListener('click', registerUserListener);

}
