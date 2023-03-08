import { HomePage, ClientesPage, ProdutosPage } from "./pages";
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
];

export default routes.map((route) => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path),
  };
});
