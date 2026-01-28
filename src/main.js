const gitUserEl = document.getElementById('github-user');
const inputEl = document.querySelector('.input-value');
const btnEl = document.querySelector('.submit-btn');

const fetchUserRepos = async (repoName) => {
  try {
    let res = await fetch(`https://api.github.com/users/${repoName}/repos`);
    let data = await res.json();

    let divEl = document.createElement('div');
    divEl.className = 'flex items-center gap-3 mt-3';
    let fragmentEl = document.createDocumentFragment();

    if (data.length > 5) {
      for (let i = 0; i <= 5; i++) {
        let repo = data[i];

        let anchorTag = document.createElement('a');
        anchorTag.setAttribute('href', `https://github.com/${repo.full_name}`);
        anchorTag.classList.add('repo-style');
        anchorTag.textContent = repo.name;

        fragmentEl.append(anchorTag);
      }

      divEl.append(fragmentEl);
      return divEl;

    } else {
      return 'No repos found in this user github!';
    }

  } catch (error) {
    console.log("Fetching error in repos", error);
    return 'No repos found in this user github!';
  }
};

const fetchUserHandle = async (user) => {
  const url = `https://api.github.com/users/${user}`;
  const userDetailsEl = document.createElement('div');
  userDetailsEl.classList.add('user-profile');
  gitUserEl.innerHTML = '';

  let divEl = '';
  divEl = await fetchUserRepos(user);
  console.log(divEl);

  try {
    let res = await fetch(url);
    let data = await res.json();

    if (res.status === 403) {
      const userDetailsEl = document.createElement('div');
      userDetailsEl.classList.add('user-profile');
      userDetailsEl.innerHTML = "REST API rate limit exceeded!";
      gitUserEl.append(userDetailsEl);
      return;
    }

    if (!res.ok) {
      const userDetailsEl = document.createElement('div');
      userDetailsEl.classList.add('user-profile');
      userDetailsEl.innerHTML = "No response from REST API";
      gitUserEl.append(userDetailsEl);
      return;
    }

    userDetailsEl.innerHTML = `
        <!-- user details -->
        <div class="flex gap-5 items-center justify-between">
          <div class="flex gap-5 items-center justify-start">
            <div class="w-20 h-20 rounded-full border-2 border-white overflow-hidden">
              <img src="${data.avatar_url}" alt="${data.login}'s Avatar"
                class="w-full h-full object-cover">
            </div>

            <div class="space-y-0.5">
              <h2 class="text-xl font-semibold">${!data.name ? data.login : data.name}</h2>
              <a href="https://github.com/${data.login}" target="_blank"
                class="text-sm italic text-gray-400 font-semibold hover:text-purple-600">${data.login}</a>
            </div>
          </div>

          <div class="flex flex-col justify-start items-center gap-2">
            <div class="flex items-center gap-3">
              <p class="text-sm text-purple-600 font-semibold">Followers: </p>
              <p class="text-sm text-gray-200">${data.followers}</p>
            </div>
            <div class="flex items-center gap-3">
              <p class="text-sm text-purple-600 font-semibold">Following: </p>
              <p class="text-sm text-gray-200">${data.following}</p>
            </div>
          </div>
        </div>

        <!-- user bio -->
        ${data.bio || data.blog ? (
        `
        <div class="bg-zinc-800 rounded-xl p-3">
          <div class="flex items-center gap-3">
            <p class="text-sm font-semibold italic">Bio: </p>
            <p class="text-sm text-gray-200">${data.bio}</p>
          </div>

          <div class="flex items-center gap-3">
            <p class="text-sm font-semibold italic">Blog: </p>
            <a href="${data.blog}" target="_blank"
              class="text-sm text-gray-200 hover:text-purple-600">${data.blog}</a>
          </div>
        </div>
        `
      ) : ""
      }

        <!-- user repos -->
        <div class='space-y-5'>
          <h2 class="italic font-semibold">Users Repos:</h2>
          ${divEl === '' ? "No repos found!" : divEl}
        </div> 
        `;

    gitUserEl.append(userDetailsEl);

  } catch (error) {
    console.log("Error in fetching user", error);
  }
};


setTimeout(() => {
  fetchUserHandle('awizp');
}, 1000);

btnEl.addEventListener('click', () => {
  let inputVal = inputEl.value.trim();

  if (inputVal === '') return;

  setTimeout(() => {
    fetchUserHandle(inputVal);
  }, 1000);
});
