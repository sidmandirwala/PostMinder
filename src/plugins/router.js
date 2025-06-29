import { createRouter, createWebHistory } from "vue-router";
import { authenticToken } from "@/helpers/jwt_helper.js";

const routes = [
  { path: "/", name: "home", component: () => import("@/views/Home.vue") },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("@/views/Signup.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404PNF",
    component: () => import("@/views/404PageNotFound.vue"),
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

router.beforeResolve(async (to, from, next) => {
  const isTokenValid = await authenticToken();
  if (isTokenValid) {
    if (to.name === "login") {
      if (from.name === "home") {
        next();
      }
      next({ name: "home" });
    } else if (to.name === "home") {
      next();
    } else if (to.name === "signup") {
      next({ name: "home" });
    } else {
      next();
    }
  } else {
    if (to.name === "login") {
      next();
    } else if (to.name === "signup") {
      next();
    } else if (to.name === "home") {
      next({ name: "login" });
    } else {
      next();
    }
  }
});

export default router;
