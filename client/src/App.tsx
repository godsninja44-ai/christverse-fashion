import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Messages from "@/pages/Messages";
import MessageDetail from "@/pages/MessageDetail";
import Fashion from "@/pages/Fashion";
import MintWearable from "@/pages/MintWearable";
import WearableDetail from "@/pages/WearableDetail";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/messages" component={Messages} />
        <Route path="/messages/:id" component={MessageDetail} />
        <Route path="/fashion" component={Fashion} />
        <Route path="/fashion/mint" component={MintWearable} />
        <Route path="/fashion/:id" component={WearableDetail} />
        <Route path="/shop" component={Shop} />
        <Route path="/shop/:id" component={ProductDetail} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
