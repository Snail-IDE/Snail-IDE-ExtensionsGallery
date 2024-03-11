<script>
    // Components
    import BarPage from "./Page.svelte";
    import BarButton from "./Button.svelte";

    const toggleTheme = () => {
        if (localStorage.getItem("sn:dark") !== "true") {
            localStorage.setItem("sn:dark", true);
            return;
        }
        localStorage.setItem("sn:dark", false);
    };
</script>

<div class="bar">
    <a class="logo" href="/">
        <img class="logo-image" src="/navicon.svg" alt="Snail IDE" />
    </a>
    <div style="margin-right: 12px;" />
    <BarPage style="padding:0.5rem" on:click={toggleTheme}>
        <img src="/icons/moon.svg" alt="Theme" />
    </BarPage>
    <BarPage link={"/docs"}>Documentation</BarPage>
</div>

<style>
    :root {
        --bright-purple: #b735ff; /* Bright purple color */
        --dark-purple: #4d0077;   /* Dark purple color */
    }

    :global(body.dark-mode) {
        --bright-purple: #6a1b9a; /* Adjusted bright purple for dark mode */
        --dark-purple: #38006b;   /* Adjusted dark purple for dark mode */
    }

    .bar {
        position: fixed;
        width: 100%;
        left: 0px;
        top: 0px;
        background: var(--bright-purple); /* Use bright purple color */
        height: 3rem;
        color: white;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        box-sizing: border-box;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 0.75rem;
        font-weight: bold;
        min-width: 1000px;
        z-index: 1000;
    }

    .logo {
        height: 100%;
    }

    .logo-image {
        margin-top: 10%;
        height: 80%;
        transition: 0.15s ease all;
    }

    .logo-image:hover {
        margin-top: 5%;
        height: 90%;
        transition: 0.15s ease all;
    }
</style>

