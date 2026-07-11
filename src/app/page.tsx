import { RouterProvider } from "@/lib/router";
import { SiteShell } from "@/components/site/site-shell";

export default function Home() {
  return (
    <RouterProvider>
      <SiteShell />
    </RouterProvider>
  );
}
