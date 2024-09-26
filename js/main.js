function dark_mode() {
  const element = document.body;
  element.classList.toggle("dark-mode");
}



const MARVEL_API = 'https://gateway.marvel.com:443/v1/public/characters?apikey=b9387eb3d701ea1e371e1f554eb585c5';
const MARVEL_COMICS_API = 'https://gateway.marvel.com:443/v1/public/characters/';
const MARVEL_EVENTS_API = 'https://gateway.marvel.com:443/v1/public/characters/';

function watchSubmit() {
  $('form').on('submit', function(event) {
    event.preventDefault();

    $('.main-results-section').prop('hidden', true);
    $('.main-events-section').prop('hidden', true);
    $('.main-comics-section').prop('hidden', true);
    $('.search-results').html(``);

    const queryTarget = $(event.currentTarget).find('input');
    const queryTerm = (queryTarget.val());

    const query1 = {
      ts: '1',
      hash: 'c516f34ed1b8c272e76721b1be1dfe71',
      nameStartsWith: queryTerm,
      limit: '6'
    };

    $.getJSON(MARVEL_API, query1, displaySearchResults);

    queryTarget.val("");
  });
}

function displaySearchResults(data) {
  const list = data.data.results;

  if (list.length === 0) {
    $('.unknown-section').html(`
      <div class='unknown'>
        <h2>No character found by that name.</h2>
      </div>
    `);

    $('.main-unknown-section').prop('hidden', false);
    $('.search-results-section').prop('hidden', true);

    return;
  }

  $('.main-unknown-section').prop('hidden', true);
  $('.search-results-section').prop('hidden', false);

  for (let i = 0; i < list.length; i++) {
    $('.search-results').append(`
      <div class="search-result">
        <a href="#" class="result-name">${list[i].name}</a>
      </div>
    `);
  }
}

function watchResultClick() {
  $(document).on('click', '.result-name', function(event) {
    event.preventDefault();

    const queryTarget = $(event.currentTarget);
    const queryTerm = (queryTarget.html());

    $('.search-results-section').prop('hidden', true);

    retrieveJSON(queryTerm, displayMarvelData);
  });
}

function retrieveJSON(searchTerm, callback1, callback2) {
  const query1 = {
    name: searchTerm,
    ts: '1',
    hash: 'c516f34ed1b8c272e76721b1be1dfe71',
  };

  $.getJSON(MARVEL_API, query1, callback1);
}

function cleanUpLink(link) {
  return link.replace('http:', 'https:');
}

function cleanUpDescription(description) {
  return description.replace(/â€™/g, "'").replace(/â€”/g, ' ');
}

function displayMarvelData(data) {
  if (data.data.results[0] === undefined) {
    $('.unknown-section').html(`
      <div class='unknown'>
        <h2>No character found by that name.</h2>
      </div>
    `);

    $('.main-unknown-section').prop('hidden', false);
    $('.main-results-section').prop('hidden', true);
    $('.main-events-section').prop('hidden', true);
    $('.main-comics-section').prop('hidden', true);

    return;
  }
  else {
    if (data.data.results[0].description === '') {
      $('.results-section').html(`
        <div class='results-text'>
          <img src='${cleanUpLink(data.data.results[0].thumbnail.path + '.' + data.data.results[0].thumbnail.extension)}' class='character-photo' alt='character-photo'>
          <h2 class='character-name'>${data.data.results[0].name}</h2>
          <hr>
          <p class='character-description'>No Description Available.</p>
        </div>
      `);

      $('.main-unknown-section').prop('hidden', true);
      $('.main-comics-section').prop('hidden', false);
      $('.main-events-section').prop('hidden', false);
      $('.main-results-section').prop('hidden', false);
    }
    else {
      $('.results-section').html(`
        <img src='${cleanUpLink(data.data.results[0].thumbnail.path + '.' + data.data.results[0].thumbnail.extension)}' class='character-photo' alt='character-photo'>
        <div class='results-text'>
          <h2 class='character-name'>${data.data.results[0].name}</h2>
          <hr>
          <p class='character-description'>${data.data.results[0].description}</p>
        </div>
      `);

      $('.main-unknown-section').prop('hidden', true);
      $('.main-comics-section').prop('hidden', false);
      $('.main-events-section').prop('hidden', false);
      $('.main-results-section').prop('hidden', false);
    }

    const query_events = {
      apikey: 'b9387eb3d701ea1e371e1f554eb585c5',
      ts: '1',
      hash: 'c516f34ed1b8c272e76721b1be1dfe71',
      limit: 3
    };

    $.getJSON(MARVEL_EVENTS_API + data.data.results[0].id + '/events', query_events, function(data) {
      const results = data.data.results.map((item, index) => {
        return `
          <div class='event-result'>
            <a href='${item.urls[0].url}' target='_blank'><img src='${cleanUpLink(item.thumbnail.path + '.' + item.thumbnail.extension)}' class='image' alt='event-photo'></a>
            <h4 class='item-title'>${item.title}</h4>
            <p class='description'>${cleanUpDescription(item.description)}</p>
          </div>
        `});

      $('.events-section').html(results);
    });

    const query_comics = {
      apikey: 'b9387eb3d701ea1e371e1f554eb585c5',
      ts: '1',
      hash: 'c516f34ed1b8c272e76721b1be1dfe71',
      limit: 3
    };

    $.getJSON(MARVEL_COMICS_API + data.data.results[0].id + '/comics', query_comics, function(data) {
      const results = data.data.results.map((item, index) => {
        if (item.description === null) {
          return `
            <div class='comic-result'>
              <a href='${item.urls[0].url}' target='_blank'><img src='${cleanUpLink(item.thumbnail.path + '.' + item.thumbnail.extension)}' class='image' alt='comic-photo'></a>
              <h4 class='item-title'>${item.title}</h4>
              <p class='no-description'>No description available.</p>
            </div>
          `;
        }
        else {
          return `
            <div class='comic-result'>
              <a href='${item.urls[0].url}' target='_blank'><img src='${cleanUpLink(item.thumbnail.path + '.' + item.thumbnail.extension)}' class='image' alt='comic-photo'></a>
              <h4 class='item-title'>${item.title}</h4>
              <p class='description'>${cleanUpDescription(item.description)}</p>
            </div>
          `;
        }
      });

      $('.comics-section').html(results);
    });
  }
}

function watchLogo() {
  $('.logo').on('click', function() {
    location.reload();
  });
}

function watchCloseClick() {
  $('.light-box-area').on('click', '.close-button', function() {
    $('.light-box-area').prop('hidden', true);
    $('iframe').attr('src', '');
  });
}

function addEventListeners() {
  watchSubmit();
  watchResultClick();
  watchLogo();
  watchCloseClick();
}

$(addEventListeners);