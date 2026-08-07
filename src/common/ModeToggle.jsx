import { useTheme } from "@/provider/ThemeProvider"
import { Moon, Sun } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"


export function ModeToggle() {
  const { theme, setTheme } = useTheme()
const themeToggle = () =>{
  setTheme(theme === "light" ? "dark" : "light")
}
  return (
    <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={themeToggle}
    aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full transition-colors hover:bg-foreground/10 dark:hover:bg-white/10">
      <AnimatePresence mode="wait" initial={false}>
      {
      theme === "light" ?
       <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.25 }}>
         <Sun className="h-[1.2rem] w-[1.2rem]" />
       </motion.span>
       :<motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.25 }}>
         <Moon className="h-[1.2rem] w-[1.2rem]" />
       </motion.span>
      }
      </AnimatePresence>
      </motion.button>
  )
}
