import { Book, Menu, Zap, BarChart3, Brain, FileText } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: JSX.Element;
  items?: MenuItem[];
}

const menu: MenuItem[] = [
  { title: "Home", url: "#" },
  {
    title: "Product",
    url: "#",
    items: [
      {
        title: "Terminal",
        description: "Real-time causal intelligence dashboard",
        icon: <BarChart3 className="size-5 shrink-0" />,
        url: "#terminal",
      },
      {
        title: "API",
        description: "Programmatic access to causal maps and alerts",
        icon: <Zap className="size-5 shrink-0" />,
        url: "#api",
      },
      {
        title: "Backtesting",
        description: "Validate signals against historical data",
        icon: <Brain className="size-5 shrink-0" />,
        url: "#backtesting",
      },
    ],
  },
  {
    title: "Research",
    url: "#",
    items: [
      {
        title: "Methodology",
        description: "How our Bayesian causal networks work",
        icon: <Brain className="size-5 shrink-0" />,
        url: "#methodology",
      },
      {
        title: "Documentation",
        description: "Technical guides and API reference",
        icon: <Book className="size-5 shrink-0" />,
        url: "#docs",
      },
      {
        title: "White Papers",
        description: "Published research on information decay",
        icon: <FileText className="size-5 shrink-0" />,
        url: "#papers",
      },
    ],
  },
];

const mobileExtraLinks = [
  { name: "About", url: "#about" },
  { name: "Ethics", url: "#ethics" },
  { name: "Contact", url: "#contact" },
];

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title} className="text-white/60">
        <NavigationMenuTrigger className="text-white/60 hover:text-white">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-80 p-3">
            <NavigationMenuLink>
              {item.items.map((subItem) => (
                <li key={subItem.title}>
                  <a
                    className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/[0.05] hover:text-white"
                    href={subItem.url}
                  >
                    <span className="text-white/50">{subItem.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {subItem.title}
                      </div>
                      {subItem.description && (
                        <p className="text-sm leading-snug text-white/50">
                          {subItem.description}
                        </p>
                      )}
                    </div>
                  </a>
                </li>
              ))}
            </NavigationMenuLink>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }
  return (
    <a
      key={item.title}
      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white"
      href={item.url}
    >
      {item.title}
    </a>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem
        key={item.title}
        value={item.title}
        className="border-b-0"
      >
        <AccordionTrigger className="py-0 font-semibold text-white hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <a
              key={subItem.title}
              className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-white/[0.05] hover:text-white"
              href={subItem.url}
            >
              <span className="text-white/50">{subItem.icon}</span>
              <div>
                <div className="text-sm font-semibold text-white">
                  {subItem.title}
                </div>
                {subItem.description && (
                  <p className="text-sm leading-snug text-white/50">
                    {subItem.description}
                  </p>
                )}
              </div>
            </a>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }
  return (
    <a key={item.title} href={item.url} className="font-semibold text-white">
      {item.title}
    </a>
  );
};

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.08] bg-[#030303]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6">
        <nav className="hidden h-16 items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-2">
              <span className="text-lg font-bold text-white tracking-tight">
                Macro-Chain
              </span>
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm">
              <a href="#signup">Join Waitlist</a>
            </Button>
          </div>
        </nav>

        {/* Mobile nav */}
        <div className="flex h-16 items-center justify-between lg:hidden">
          <a href="#" className="flex items-center gap-2">
            <span className="text-lg font-bold text-white tracking-tight">
              Macro-Chain
            </span>
          </a>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/[0.05]"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  <a href="#" className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white tracking-tight">
                      Macro-Chain
                    </span>
                  </a>
                </SheetTitle>
              </SheetHeader>
              <div className="my-6 flex flex-col gap-6">
                <Accordion
                  type="single"
                  collapsible
                  className="flex w-full flex-col gap-4"
                >
                  {menu.map((item) => renderMobileMenuItem(item))}
                </Accordion>
                <div className="border-t border-white/[0.08] py-4">
                  <div className="grid grid-cols-2 justify-start">
                    {mobileExtraLinks.map((link, idx) => (
                      <a
                        key={idx}
                        className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-white/50 transition-colors hover:bg-white/[0.05] hover:text-white"
                        href={link.url}
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button asChild>
                    <a href="#signup">Join Waitlist</a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
