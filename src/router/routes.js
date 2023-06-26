import CardDetail from '../components/CardDetail.vue';

const routes = [
  // {
  //   path: '/',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [
  //     { path: '', component: () => import('pages/IndexPage.vue') },
   
  //   ]
  // },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('../components/TitleComponent.vue') },
   
    ]
  },
  {
    path: '/country/:id',
    name: 'detalle',
    component: CardDetail
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  },
 
];

export default routes;
