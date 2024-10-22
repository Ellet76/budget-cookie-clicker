<script>
    import { enhance } from '$app/forms';

    export let data;
</script>

<p>Welcome {data.user.username}</p>

<form action="?/logout" method="post" use:enhance>
    <button>Logout</button>
</form>


<p>Change your clicker (co-op)</p>
<form action="?/change_clicker" method="post">
    <label for="id">Id of clicker</label>
    <input type="text" name="id" id="">
    <button>Change</button>
</form>

<p>{data.clicker?.id}</p>
<p>{data.clicker?.name}</p>


<form action="?/click" method="post" use:enhance>
    <input type="hidden" name="id" value="{data.clicker?.id}">
    <button>{data.clicks}</button>
</form>