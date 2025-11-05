'use client';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from '@nextui-org/react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Shield } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';

const menuItems = [
  { name: 'Home', href: '/' },
  { name: 'Hardcoded Secrets', href: '/demos/hardcoded' },
  { name: 'Environment Variables', href: '/demos/environment-variables' },
  { name: 'Shared Secrets', href: '/demos/shared-secrets' },
  { name: 'Comparison', href: '/comparison' },
  { name: 'Best Practices', href: '/best-practices' },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className="border-b border-divider"
      maxWidth="2xl"
    >
      <NavbarContent justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className="sm:hidden" />
        <NavbarBrand className="gap-2">
          <Shield className="text-primary" size={20} />
          <p className="font-bold text-inherit">Node Secrets Guide</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.name} isActive={pathname === item.href}>
            <Link
              as={NextLink}
              color={pathname === item.href ? 'primary' : 'foreground'}
              href={item.href}
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Button
          isIconOnly
          variant="light"
          aria-label="Toggle theme"
          onPress={toggleTheme}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.name} isActive={pathname === item.href}>
            <Link
              as={NextLink}
              className="w-full"
              color={pathname === item.href ? 'primary' : 'foreground'}
              href={item.href}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
