import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "topic",
    component: () => import("@/views/index/index.vue"),
  },
  {
    path: "/home",
    redirect: "/home",
    component: () => import("../views/layout/layout.vue"),
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("../views/home/home.vue"),
      },
      {
        path: "/detail/:id",
        name: "detail",
        component: () => import("../views/detail/detail.vue"),
      },
    ],
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

export default router;
