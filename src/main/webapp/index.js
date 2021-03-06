const OK = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

let registerContentDivEl;
let loginContentDivEl;
let welcomeContentDivEl;
let profileContentDivEl;
let taskContentDivEl;
let tasksContentDivEl;
let scheduleContentDivEl;
let schedulesContentDivEl;
let scheduleTasksContentDivEl;
let taskListDropDivEl;
let backToProfileContentDivEl;
let logoutContentDivEl;
let sharedSchedulesContentDivEl;
let loginGoogleContentDivEl;

function newInfo(targetEl, message) {
    newMessage(targetEl, 'info', message);
}

function newError(targetEl, message) {
    newMessage(targetEl, 'error', message);
}

function newMessage(targetEl, cssClass, message) {
    clearMessages();

    const pEl = document.createElement('p');
    pEl.classList.add('message');
    pEl.classList.add(cssClass);
    pEl.textContent = message;

    targetEl.appendChild(pEl);
}

function clearMessages() {
    const messageEls = document.getElementsByClassName('message');
    for (let i = 0; i < messageEls.length; i++) {
        const messageEl = messageEls[i];
        messageEl.remove();
    }
}

function showContents(ids) {
    const contentEls = document.getElementsByClassName('content');
    for (let i = 0; i < contentEls.length; i++) {
        const contentEl = contentEls[i];
        if (ids.includes(contentEl.id)) {
            contentEl.classList.remove('hidden');
        } else {
            contentEl.classList.add('hidden');
        }
    }
}

function removeAllChildren(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}

function onNetworkError(response) {
    document.body.remove();
    const bodyEl = document.createElement('body');
    document.appendChild(bodyEl);
    newError(bodyEl, 'Network error, please try relodaing the page');
}

function onOtherResponse(targetEl, xhr) {
    if (xhr.status === NOT_FOUND) {
        newError(targetEl, 'Not found');
        console.error(xhr);
    } else {
        const json = JSON.parse(xhr.responseText);
        if (xhr.status === INTERNAL_SERVER_ERROR) {
            newError(targetEl, `Server error: ${json.message}`);
        } else if (xhr.status === UNAUTHORIZED || xhr.status === BAD_REQUEST) {
            newError(targetEl, json.message);
        } else {
            newError(targetEl, `Unknown error: ${json.message}`);
        }
    }
}

function hasAuthorization() {
    return localStorage.getItem('user') !== null;
}

function setAuthorization(user) {
    return localStorage.setItem('user', JSON.stringify(user));
}

function getAuthorization() {
    return JSON.parse(localStorage.getItem('user'));
}

function setUnauthorized() {
    return localStorage.removeItem('user');
}

function hideMenuContent() {
    const menu = document.getElementById('menu-content');
    removeAllChildren(menu);
}

function checkIfUserRoleIsGuest() {
    const pathArray = window.location.pathname.split('/');
    const keyWord = pathArray[2];
    if (keyWord === 'share') {
        const idArray = window.location.search.replace('?', ' ').replace('=', ' ').split(' ');
        const scheduleId = idArray[idArray.length - 1];
        const shareScheduleId = document.getElementById('shareId');
        shareScheduleId.textContent = scheduleId;
        onViewClicked();
    }
}

function onLoad() {
    registerContentDivEl = document.getElementById('register-content');
    loginContentDivEl = document.getElementById('login-content');
    welcomeContentDivEl = document.getElementById('welcome-content');
    profileContentDivEl = document.getElementById('profile-content');
    taskContentDivEl = document.getElementById('task-content');
    tasksContentDivEl = document.getElementById('tasks-content');
    scheduleContentDivEl = document.getElementById('schedule-content');
    schedulesContentDivEl = document.getElementById('schedules-content');
    scheduleTasksContentDivEl = document.getElementById('schedule-tasks-content');
    taskListDropDivEl = document.getElementById('task-list-drop');
    sharedSchedulesContentDivEl = document.getElementById('shared-schedule');
    backToProfileContentDivEl = document.getElementById('back-to-profile-content');
    logoutContentDivEl = document.getElementById('logout-content');
    loginGoogleContentDivEl = document.getElementById('g-signin2');

    const registerButtonEl = document.getElementById('register-button');
    registerButtonEl.addEventListener('click', onRegisterButtonClick);

    const loginButtonEl = document.getElementById('login-button');
    loginButtonEl.addEventListener('click', onLoginButtonClicked);

    const logoutButtonEl = document.getElementById('logout-button');
    logoutButtonEl.addEventListener('click', onLogoutButtonClicked);

    const tologinButtonEl = document.getElementById('tologin-button');
    tologinButtonEl.addEventListener('click', toLoginButtonClick);

    const toregisterButtonEl = document.getElementById('toregister-button');
    toregisterButtonEl.addEventListener('click', toRegisterButtonClick);

    checkIfUserRoleIsGuest();

    if (hasAuthorization()) {
        onProfileLoad(getAuthorization());
    }
}

document.addEventListener('DOMContentLoaded', onLoad);
