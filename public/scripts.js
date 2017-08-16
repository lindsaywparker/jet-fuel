// Setup


// Functions
const emptyFolderInput = () => {
  $('.new-folder-input').val('');
};

const createFolder = (e) => {
  e.preventDefault();
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
    .then((response) => {
      emptyFolderInput();
      return response.json();
    })
    .catch(error => error);
};


// Event Listeners
$('.create-folder-form').on('submit', (e) => {
  e.preventDefault();
  createFolder(e);
});

