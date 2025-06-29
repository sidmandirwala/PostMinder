<template>
    <div id="center">
        <v-container>
            <v-row no-gutters justify="center">
                <h1>Uh Oh <span style="color: rgb(224, 67, 54);">404!</span></h1>
            </v-row>
            <v-row no-gutters justify="center">
                <h1>Looks like you are lost</h1>
            </v-row>
            <br>
            <v-row no-gutters justify="center">
                <v-btn @click="this.$router.push({ name: 'home' })" color="red">Go Back Home</v-btn>
            </v-row>
        </v-container>
    </div>
</template>

<style scoped>
#center {
    display: flex;
    align-items: center;
    height: 100vh;
}
</style>