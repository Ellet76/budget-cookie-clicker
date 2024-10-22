<script lang="ts">
    import type { PageData, ActionData } from './$types';
    import { enhance } from '$app/forms';

    export let form: ActionData
</script>


<form action="?/login" method="post" use:enhance>
    <div>
        <input type="text" name="username" id="" >
        <input type="password" name="password" id="">
        <button>LOGIN</button>
    </div>
    {#if form?.login_fail}
    <span>{form.login_fail}</span>
    {/if}
</form>
