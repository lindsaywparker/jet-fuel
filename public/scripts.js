// Setup


// Functions
const emptyFolderInput = () => {
  $('.new-folder-input').val('');
};

const emptyLinkInput = () => {
  $('.new-link-label').val('');
  $('.new-link-long').val('');
};

const updateFolderDropdown = (folderName, folderID) => {
  $('#folder-dropdown').prepend(`
      <option value='${folderID}'>${folderName}</option> 
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
      emptyFolderInput();
      updateFolderDropdown(folderName, folder.id);
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
    })
    .catch(error => console.log(error));
};


// Event Listeners
$('.create-folder-form').on('submit', (e) => {
  e.preventDefault();
  createFolder();
});

$('.shorten-url-form').on('submit', (e) => {
  e.preventDefault();
  createLink();
});

