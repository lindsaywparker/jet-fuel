// Functions
const formatDate = (date) => {
  const [year, month, day] = date.slice(0, 10).split('-');
  const newDate = `${month}-${day}-${year}`;
  return newDate;
};

const setupFolders = () => {
  fetch('/api/v1/folders')
    .then(response => response.json())
    .then(folders => folders.map((folder) => {
      $('#folder-dropdown').prepend(`
        <option value='${folder.id}'>${folder.folderName}</option>
      `);
      $('.folder-pane').prepend(`
        <div class='folder-header-with-sort'>
          <p class='view-folder-name' onclick='toggleFolderView()'>${folder.folderName}</p>
          <div class='sort-controls'>
            <p class='sorting-title'>Sort by:</p>
            <p class='sorting-direction' onclick='setupLinks("newest")'>newest</p>
            <p class='sorting-direction' onclick='setupLinks("oldest")'>oldest</p>
          </div>
        </div>
        <table class='folder-links-${folder.id}'></table>
      `);
    },
    ));
};

const setupLinks = (order) => {
  fetch('/api/v1/links')
    .then(response => response.json())
    .then((links) => {
      const sortedLinks = links.sort((a, b) => {
        if (order === 'newest') {
          return b.id - a.id;
        }
        return a.id - b.id;
      });

      $('table').text('');
      sortedLinks.map((link) => {
        $(`.folder-links-${link.folderID}`).prepend(`
          <tr>
            <td class='view-link-title'>${link.linkLabel}</td>
            <td class='view-link-shortUrl' onclick='redirect(${link.id})'>${link.linkShort}</td>
            <td class='view-link-date'>${formatDate(link.created_at)}</td>
          </tr>
        `);
      });
    });
};

const validURL = (url) => {
  const space = url.includes(' ');
  const backslash = url.includes('\\');
  const dot = url.includes('.');

  return (!space && !backslash && dot);
};

const displayStatusMsg = (message, location) => {
  $(`.${location}-status-msg`).text(message);
};

const emptyFolderForm = () => {
  $('.new-folder-input').val('');
  $('.folder-status-msg').text('');
};

const emptyLinkForm = () => {
  $('.new-link-label').val('');
  $('.new-link-long').val('');
  $('.link-status-msg').text('');
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
        throw new Error('Folder already exists');
      }
      $('.new-link-label').focus();
      emptyFolderForm();
      displayStatusMsg(`'${folderName}' created successfully`, 'folder');
      updateFolderDOM(folderName, folder.id);
    })
    .catch(error => displayStatusMsg(error, 'folder'));
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
          throw new Error('Link already exists');
        }
        emptyLinkForm();
        displayStatusMsg(`'${linkLabel}' saved successfully`, 'link');
        updateLinkDOM(link);
      })
      .catch(error => displayStatusMsg(error, 'link'));
  } else {
    displayStatusMsg('Not a valid URL', 'link');
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
setupLinks('newest');

// Event Listeners
$('.create-folder-form').on('submit', (e) => {
  e.preventDefault();
  createFolder();
});

$('.shorten-url-form').on('submit', (e) => {
  e.preventDefault();
  createLink();
});

