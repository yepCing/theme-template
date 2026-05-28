import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
const routes: RouteRecordRaw[] = [
  // {
  //   path: "/",
  //   name: "topic",
  //   component: () => import("@/views/index/index.vue"),
  // },
  {
    path: "/:bucketName/home",
    redirect: "/home",
    component: () => import("../views/layout/layout.vue"),
    children: [
      {
        path: "/:bucketName/home",
        name: "home",
        component: () => import("../views/home/home.vue"),
      },
      {
        path: "/:bucketName/detail/:id",
        name: "detail",
        component: () => import("../views/detail/detail.vue"),
      },
      {
        path: "/:bucketName/hive",
        name: "hive",
        component: () => import("../views/hive/hive.vue"),
      },
    ],
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

router.beforeEach((to, from, next) => {
  const isHivePage = /\/\w+\/hive/.test(to.path);
  if (isHivePage) {
    if (localStorage.token && localStorage.address) {
      next();
    } else {
      next("/" + to.params.bucketName + "/home");
    }
  }
  next();
});

export default router;
