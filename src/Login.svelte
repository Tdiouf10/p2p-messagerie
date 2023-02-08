<script>
  import { user } from './user';

  let username;
  let password;

  function login() {
    user.auth(username, password, ({ err }) => err && alert(err));
  }

  function signup() {
    user.create(username, password, ({ err }) => {
      if (err) {
        alert(err);
      } else {
        login();
      }
    });
  }
</script>

<label for="username">Pseudo</label>
<input bind:value={username} minlength="3" maxlength="16" />

<label for="password">Mot de passe</label>
<input bind:value={password} type="password" />

<button on:click={login}>Connexion</button>
<button on:click={signup}>Inscription</button>
  
