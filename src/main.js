import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./style.css";

const app = createApp(App);

app.use(router);

app.mount("#app");

/**
const response = await fetch(baseEndpoint + "", {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({
    }),
});

const res = await response.json();

if (response.status) {

} else {
    
}
*/
