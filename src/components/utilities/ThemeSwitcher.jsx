import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = (e) => {
    setTheme(e.target.checked ? "dark" : "light");
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={theme === "dark"}
        onChange={toggleTheme}
      />

      {/* Switch */}
      <div
        className="
          w-16 h-8 rounded-full
          bg-gradient-to-r from-yellow-300 to-orange-400
          peer-checked:from-slate-500 peer-checked:to-gray-600
          transition-all duration-500
          after:content-['☀️']
          peer-checked:after:content-['🌙']
          after:absolute after:top-1 after:left-1
          after:h-6 after:w-6
          after:bg-white after:rounded-full
          after:flex after:items-center after:justify-center
          after:text-sm
          after:shadow-md
          after:transition-all after:duration-500
          peer-checked:after:translate-x-8
        "
      />
    </label>
  );
};

export default ThemeSwitcher;
