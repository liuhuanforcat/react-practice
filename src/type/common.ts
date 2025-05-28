

export interface RouteConfig {
  path: string;
  element: any;
  children?: RouteConfig[];
  index?: boolean;
  title?: string;
  requiresAuth?: boolean;
}