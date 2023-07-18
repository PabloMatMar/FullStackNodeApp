//despliegue del menu 'hamburguesa'
if (document.querySelector(".burger_menu")) {
  document.querySelector(".burger_menu").addEventListener("click", () => {
    let links = document.getElementById("links_menu");
    links.style.display == "block" ? links.style.display = "none" : links.style.display = "block";
  });
}


//LLAMADAS A RUTAS DE ADMIN

//Ruta para crear pelicula en mongo:
const createMovie = async (movie) => {
  let response = { status: 500 };
  try {
    response = await fetch('/movies/create/Movie', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(movie)
    });
    location.href = `/movies`;
  } catch (err) {
    console.log(err);
  };
  if (response.status != 201)
    alert("The movie " + movie.title + " could not be created check that the title is not repeated");
};

//Ruta para eliminar pelicula de mongo:
const deleteMovie = async (title) => {
  let response = { status: 500 };
  try {
    response = await fetch('/movies/deleteMovie?title=' + title, {
      method: 'DELETE'
    });
    location.href = `/movies`;
  } catch (err) {
    console.log(err);
  };
  if (response.status != 200)
    alert("The movie " + title + " could not be deleted, you probably have already deleted it, refresh the page to check it.");
};

//Ruta para actualizar pelicula de mongo:
const updateMovie = async (movie) => {
  let response = { status: 500 };
  try {
    response = await fetch('/movies/update/Movie', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(movie)
    });
    const title = localStorage.getItem("title");
    location.href = `/movies/:${title}`;
  } catch (err) {
    console.log(err);
  };
  if (response.status != 201)
    alert("The movie " + movie.title + " could not be deleted, you probably have already deleted it, refresh the page to check it.");
};

//LLAMADAS A RUTAS DE USUARIO
//Ruta para añadir pelicula a favoritos: 
const addFavorite = async (movie) => {
  let response = { status: 500 };
  try {
    response = await fetch('/favMovies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(movie)
    });
    location.href = `/favmovies`;
  } catch (err) {
    console.log(err);
  };
  if (response.status != 201)
    alert("The movie " + movie.title + " could not be add to favorites list, you probably have already added it, go to favorites to check it.");
};

//Ruta para eliminar pelicula de favoritos:
const deleteFavMovie = async (data) => {
  let response = { status: 500 };
  try {
    response = await fetch('/favmovies', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    location.href = `/favmovies`;
  } catch (err) {
    alert(err);
    console.log(err);
  };
  if (response.status != 200)
    alert("The movie " + data.title + " could not be deleted from favorites list, you probably have already deleted it, refresh the page to check it.");
};

//Eventos para capturar los datos de los formularios

if (document.getElementById("signup") != null) {
  //validacion de la contraseña y el usuario cuando se registra:
  document.querySelector("form.signup").addEventListener("submit", event => {
    event.preventDefault(); // parar envío
    let errs = [0, 0, 0, 0];
    if (event.target.passwordSignup.value != event.target.password2Signup.value)
      errs[0] = 1;
    if (!(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{6,16}$/.test(event.target.passwordSignup.value)))
      errs[1] = 1;
    if (!(/^[a-zA-Z0-9_.]+@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,3}/.test(event.target.emailSignup.value)))
      errs[2] = 1;
    if (event.target.avatar.value.length != 0 && !/.*(jpg|png|jpeg|gif)$/.test(event.target.avatar.value))
      errs[3] = 1;
    errs.find(e => e == 1) == 1 ? location.href = `/signup/:${JSON.stringify(errs)}` : event.target.submit();
  });
};

//Evento para capturar los datos y llamar a la funcion para actualizar pelicula a lista de mongo a traves de admin:

if (document.title == "Movies") {
  const anchors = document.getElementsByClassName("update");
  for (let i = 0; i < anchors.length; i++)
    document.getElementById(`update${i}`).addEventListener('click', async (e) => {
      e.preventDefault;
      let title = document.getElementById(`title${i}`).innerHTML;
      localStorage.setItem("title", title);
    });
};

if (document.title === "updateMovie") {
  document.getElementById("updateMovie").addEventListener("click", async (e) => {
    e.preventDefault();
    const form = document.querySelector(".updateMovie").elements;
    const data = {};
    for (let input of form)
      data[input.name] = input.value;
    await updateMovie({ ...{ 'title': localStorage.getItem("title") }, ...data });
  });
};
//Evento para capturar los datos y llamar a la funcion para eliminar pelicula a lista de mongo a traves de admin:
if (document.title === "Movies") {
  const buttons = document.getElementsByClassName("delete")
  for (let i = 0; i < buttons.length; i++)
    document.getElementById(`delete${i}`).addEventListener('click', async e => {
      const title = document.getElementById(`title${i}`).innerText;
      const confirmation = document.getElementById(`confirmation${i}`);
      confirmation.style.display = "block";
      const children = confirmation.childNodes;
      for (let j = 0; j < children.length; j++)
        children[j].addEventListener('click', async e => j == 2 ? await deleteMovie(title) : confirmation.style.display = "none");
    });
};

//Evento para capturar los datos y llamar a la funcion para crear pelicula a lista de mongo a traves de admin:
if (document.title == "CreateMovie") {
  document.getElementById("createMovie").addEventListener("click", async (e) => {
    e.preventDefault();
    const form = document.querySelector(".createMovie").elements;
    const data = {};
    for (let input of form)
      data[input.name] = input.value;
    await createMovie(data);
  });
};
//Evento para capturar los datos y llamar a la funcion para añadir pelicula favorita de la lista de un usuario:

if (document.title == "search") {
  const favButton = document.getElementById("fav");
  let movie = {};
  if (favButton != null)
    favButton.addEventListener('click', async e => {
      const section = document.getElementById("card");
      const children = section.childNodes;
      for (let j = 0; j < children.length; j++)
        children[j].id == 'poster' ? movie[children[j].id] = children[j].src : movie[children[j].id] = children[j].innerText.slice(children[j].innerText.indexOf(':') + 1);
      await addFavorite(movie);
    });
};

//Evento para capturar los datos y llamar a la funcion para eliminar pelicula favorita de la lista de un usuario:

if (document.getElementById("favMovies") != null) {
  const buttons = document.getElementsByClassName("delete")
  for (let i = 0; i < buttons.length; i++) {
    const deleteButton = document.getElementById(`delete${i}`);
    deleteButton.addEventListener('click', async e => {
      e.preventDefault;
      const title = document.getElementById(`title${i}`).innerHTML;
      const data = {
        title: title
      };
      const confirmation = document.getElementById(`confirmation${i}`);
      confirmation.style.display = "block";
      const children = confirmation.childNodes;
      for (let j = 0; j < children.length; j++)
        children[j].addEventListener('click', async e => j == 2 ? await deleteFavMovie(data) : confirmation.style.display = "none");
    });
  };
};

//Evento para mostrar el spinner mientras se carga la pelicula (el scrapping mas bien)

if (document.title == "search") {
  document.getElementById("search-button").addEventListener("click", e => {
    let section = document.getElementById("card");
    setTimeout(() => {
      if (section != null)
        while (section.firstChild)
          section.removeChild(section.firstChild);
      else {
        section = document.getElementById("spinner");
        section.setAttribute('class', 'card');
      }
      const spinner = document.createElement("img");
      section.appendChild(spinner);
      spinner.setAttribute('id', 'gif');
      spinner.src = "/logos/spinner2.gif";
    }, 500);
  });
};

if (document.getElementById("search-Not-Found-FavMovie") != null) {
  document.getElementById("search-Not-Found-FavMovie").addEventListener("click", e => {
    const article = document.getElementById("card");
    setTimeout(() => {
      while (article.firstChild)
        article.removeChild(article.firstChild);
      const spinner = document.createElement("img");
      article.appendChild(spinner);
      spinner.setAttribute('id', 'gif');
      spinner.src = "/logos/spinner2.gif";
    }, 500);
  });
};

//Evento para capturar los datos y llamar a la funcion para cambiar el avatar de un usuario:
if (document.getElementById("updtAvatar") != null) {
  document.querySelector("form.updtAvatar").addEventListener("submit", e => {
    e.preventDefault();
    let errs = [0, 0, 0, 0];
    if (!(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{6,16}$/.test(e.target.password.value)))
      errs[1] = 1;
    if (e.target.avatar.value.length != 0 && !/.*(jpg|png|jpeg|gif)$/.test(e.target.avatar.value))
      errs[3] = 1;
    errs.find(e => e == 1) == 1 ? location.href = `/user/updtAvatar/:${JSON.stringify(errs)}` : e.target.submit();
  });
};

//Evento para capturar los datos y llamar a la funcion para cambiar la contraseña de un usuario:

if (document.getElementById("updtPassword") != null) {
  document.querySelector("form.updtPassword").addEventListener("submit", e => {
    e.preventDefault();
    let errs = [0, 0, 0, 0];
    if (e.target.password.value != e.target.rPassword.value)
      errs[0] = 1;
    if (!(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{6,16}$/.test(e.target.password.value)))
      errs[1] = 1;
    if (!(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{6,16}$/.test(e.target.oldPassword.value)))
      errs[1] = 1;
    errs.find(e => e == 1) == 1 ? location.href = `/user/updtPassword/:${JSON.stringify(errs)}` : e.target.submit();
  });
};

//Evento para capturar los datos asi como los errores en el proceso de eliminacion de un usuario

if (document.getElementById("deleteUser") != null) {
  document.querySelector("form.deleteUser").addEventListener("submit", e => {
    e.preventDefault();
    let errs = [0, 0, 0, 0];
    if (!(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{6,16}$/.test(e.target.password.value)))
      errs[1] = 1;
    if (!(/^[a-zA-Z0-9_.]+@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,3}/.test(e.target.email.value)))
      errs[2] = 1;
    if (errs.find(e => e == 1) == 1)
      location.href = `/user/deleteUser/:${JSON.stringify(errs)}`
    else {
      const confirmation = document.getElementById('confirmation');
      confirmation.style.display = "block";
      const children = confirmation.childNodes;
      for (let j = 0; j < children.length; j++)
        children[j].addEventListener('click', async _ => j == 2 ? e.target.submit() : (confirmation.style.display = "none", location.href = '/user'));
    }
  });
};


