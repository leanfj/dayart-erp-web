import { HomePage, ClientesPage, ProdutosPage, MateriaisPage } from "./pages";
import { withNavigationWatcher } from "./contexts/navigation";

const routes = [
  {
    path: "/home",
    element: HomePage,
  },
  {
    path: "/clientes",
    element: ClientesPage,
  },
  {
    path: "/produtos",
    element: ProdutosPage,
  },
  {
    path: "/materiais",
    element: MateriaisPage,
  },
];

export default routes.map((route) => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path),
  };
});
