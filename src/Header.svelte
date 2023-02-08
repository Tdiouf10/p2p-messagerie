<script>
  import { username, user } from './user';

  function signout() {
    user.leave();
    username.set('');
  }
</script>

<header>
<h1>Messagerie</h1>
  {#if $username}
    <div>
      <span>Bonjour <strong>{$username}</strong></span>
    </div>
    <button on:click={signout}>Déconnexion</button>
  {/if}
</header>