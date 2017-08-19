// Functions
const setupFolders = () => {
  fetch('/api/v1/folders')
    .then(response => response.json())
    .then(folders => folders.map((folder) => {
      $('#folder-dropdown').prepend(`
        <option value='${folder.id}'>${folder.folderName}</option>
      `);
      $('.folder-pane').prepend(`
        <p class='view-folder-name' onclick='toggleFolderView()'>${folder.folderName}</p>
        <table class='folder-links-${folder.id}'></table>
      `);
    },
    ));
};

const setupLinks = () => {
  fetch('/api/v1/links')
    .then(response => response.json())
    .then(links => links.map((link) => {
      $(`.folder-links-${link.folderID}`).prepend(`
        <tr>
          <td class='view-link-title'>${link.linkLabel}</td>
          <td class='view-link-shortUrl' onclick='redirect(${link.id})'>${link.linkShort}</td>
          <td class='view-link-date'>${link.created_at}</td>
        </tr>
      `);
    }));
};

const validURL = (url) => {
  const space = url.includes(' ');
  const backslash = url.includes('\\');
  const dot = url.includes('.');

  return (!space && !backslash && dot);
};

const displayErrorMsg = (message, location) => {
  $(`.${location}-error-msg`).text(message);
};

const emptyFolderInput = () => {
  $('.new-folder-input').val('');
};

const emptyLinkInput = () => {
  $('.new-link-label').val('');
  $('.new-link-long').val('');
};

const updateFolderDOM = (folderName, folderID) => {
  $('#folder-dropdown').prepend(`
    <option value='${folderID}'>${folderName}</option> 
  `);

  $('.folder-pane').prepend(`
    <p class='view-folder-name' onclick='toggleFolderView()'>${folderName}</p>
    <table class='folder-links-${folderID}'></table>
  `);
};

const updateLinkDOM = (link) => {
  $(`.folder-links-${link.folderID}`).prepend(`
    <tr>
      <td class='view-link-title'>${link.linkLabel}</td>
      <td class='view-link-shortUrl' onclick='redirect(${link.id})'>${link.linkShort}</td>
      <td class='view-link-date'>${link.created_at}</td>
    </tr>
  `);
};

const createFolder = () => {
  const folderName = $('.new-folder-input').val();
  fetch('/api/v1/folders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      folderName,
    }),
  })
    .then(response => response.json())
    .then((folder) => {
      if (folder.error) {
        $('.new-folder-input').focus();
        throw new Error('This folder already exists.');
      }
      $('.new-link-label').focus();
      emptyFolderInput();
      updateFolderDOM(folderName, folder.id);
    })
    .catch(error => console.log(error));
};

const createLink = () => {
  const linkLabel = $('.new-link-label').val();
  const folderID = $('#folder-dropdown').val();
  let linkLong = $('.new-link-long').val();

  if (validURL(linkLong)) {
    if (!linkLong.startsWith('http')) linkLong = `http://${linkLong}`;

    fetch('/api/v1/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        linkLabel,
        linkLong,
        folderID,
      }),
    })
      .then(response => response.json())
      .then((link) => {
        $('.new-link-label').focus();
        if (link.error) {
          throw new Error('This link already exists.');
        }
        emptyLinkInput();
        updateLinkDOM(link);
      })
      .catch(error => console.log(error));
  } else {
    displayErrorMsg('Not a valid URL', 'link');
    $('.new-link-long').focus();
  }
};

const toggleFolderView = () => {
  console.log('hi, I should toggle folder view');
};

const redirect = (linkID) => {
  fetch(`/api/v1/links/${linkID}`)
    .then(response => response.json())
    .then(link => window.open(link));
};

// Setup
setupFolders();
setupLinks();

// Event Listeners
$('.create-folder-form').on('submit', (e) => {
  e.preventDefault();
  createFolder();
});

$('.shorten-url-form').on('submit', (e) => {
  e.preventDefault();
  createLink();
});

