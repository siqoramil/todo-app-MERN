import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckSquare,
  Moon,
  Sun,
  Monitor,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { useLogout } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const ThemeIcon = themeIcons[theme];

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]!);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TodoApp</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={cycleTheme}
              title={`Theme: ${theme}`}
            >
              <ThemeIcon className="h-5 w-5" />
            </Button>

            {user && (
              <div className="relative">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block">{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full z-50 mt-2 w-56 rounded-md border bg-card shadow-lg"
                      >
                        <div className="p-2">
                          <div className="px-3 py-2 text-sm">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-muted-foreground">{user.email}</p>
                          </div>
                          <div className="my-1 h-px bg-border" />
                          <button
                            className={cn(
                              'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent',
                              isLoggingOut && 'opacity-50 cursor-not-allowed'
                            )}
                            onClick={() => {
                              setIsDropdownOpen(false);
                              logout();
                            }}
                            disabled={isLoggingOut}
                          >
                            <LogOut className="h-4 w-4" />
                            {isLoggingOut ? 'Logging out...' : 'Log out'}
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
