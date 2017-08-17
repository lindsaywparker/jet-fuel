
// Functions
const setupFolders = () => {
  fetch('/api/v1/folders')
    .then(response => response.json())
    .then(folders => folders.map(folder =>
      $('#folder-dropdown').prepend(`
        <option value='${folder.folderID}'>${folder.folderName}</option>
      `),
    ));
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
    <p class='view-folder-name'>${folderName}</p>
    <table class='folder-links-${folderID}'></table>
  `);
};

const updateLinkDOM = (link) => {
  $(`.folder-links-${link.folder_id}`).prepend(`
    <tr>
      <td class='view-link-title'>${link.linkLabel}</td>
      <td class='view-link-shortUrl'>${link.linkShort}</td>
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
      $('.new-link-label').focus();
      emptyFolderInput();
      updateFolderDOM(folderName, folder.id);
    })
    .catch(error => console.log(error));
};

const createLink = () => {
  const linkLabel = $('.new-link-label').val();
  const linkLong = $('.new-link-long').val();
  const folder_id = $('#folder-dropdown').val();

  fetch('/api/v1/links', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      linkLabel,
      linkLong,
      folder_id,
    }),
  })
    .then(response => response.json())
    .then((link) => {
      $('.new-link-label').focus();
      emptyLinkInput();
      updateLinkDOM(link);
    })
    .catch(error => console.log(error));
};

// Setup
setupFolders();


// Event Listeners
$('.create-folder-form').on('submit', (e) => {
  e.preventDefault();
  createFolder();
});

$('.shorten-url-form').on('submit', (e) => {
  e.preventDefault();
  createLink();
});

