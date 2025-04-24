function createWelcome() {
    const welcomeSpan = document.createElement('span');
    welcomeSpan.id = 'welcome';

    const welcomeVideo = document.createElement('video');
    welcomeVideo.autoplay = true;
    welcomeVideo.muted = true;
    welcomeVideo.src = '../videos/ts_signature-anim.mp4';

    welcomeSpan.appendChild(welcomeVideo);

    return welcomeSpan;
}

function createHeader() {
    const header = document.querySelector('header');

    const logoDiv = document.createElement('div');
    logoDiv.id = 'home';

    const logoSpan = document.createElement('span');
    const logoA = document.createElement('a');
    logoA.id = 'ts-logo';
    logoA.href = 'index.html';
    logoA.target = '_self';

    const menu = document.createElement('menu');

    const projectLi = document.createElement('li');
    const projectA = document.createElement('a');
    projectA.className = 'text-button underline';
    projectA.href = '#';
    projectA.target = '_self';
    projectA.textContent = 'Projets';

    const contactLi = document.createElement('li');
    const contactA = document.createElement('a');
    contactA.className = 'text-button underline';
    contactA.href = '#';
    contactA.target = '_self';
    contactA.textContent = 'Contact';

    header.append(logoDiv, menu);
    logoDiv.appendChild(logoSpan);
    logoSpan.appendChild(logoA);
    menu.append(projectLi, contactLi);
    projectLi.appendChild(projectA);
    contactLi.appendChild(contactA);

    return header;
}

function createDefault() {
    welcome = createWelcome();
    header = createHeader();
    container = document.querySelector('main');

    // document.body.insertBefore(header, container);
    document.body.insertBefore(welcome, header);

    return
}

createDefault();