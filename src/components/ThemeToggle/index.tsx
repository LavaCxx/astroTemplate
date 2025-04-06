import { createSignal } from "solid-js";
import type { Component } from "solid-js";
import styles from "./ThemeToggle.module.css";
import "../../styles/theme-transitions.css";

const ThemeToggle: Component = () => {
  const [isTransitioning, setIsTransitioning] = createSignal(false);

  const switchTheme = (newTheme: string, skipAnimation = false) => {
    document.documentElement.className = newTheme;
    localStorage.setItem("theme", newTheme);
  };


  const toggleTheme = async (event: MouseEvent) => {
    // 如果已经在转换中，则退出
    if (isTransitioning()) return;
    setIsTransitioning(true);

    const isDark = document.documentElement.classList.contains("dark");
    const newTheme = isDark ? "light" : "dark";

    // 获取点击位置，或者回退到页面中间
    const x = event.clientX;
    const y = event.clientY;

    // 获取到最远角的距离
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // 检查是否支持视图过渡
    const isViewTransitionsSupported =
      "startViewTransition" in document &&
      typeof document.startViewTransition === "function";

    if (isViewTransitionsSupported) {
      try {
        // 直接设置class属性，这很重要
        // @ts-ignore - TypeScript 可能不知道 startViewTransition
        const transition = document.startViewTransition(() => {
          switchTheme(newTheme);
        });

        const circlePath = [
          `circle(${endRadius}px at ${x}px ${y}px)`,
          `circle(0 at ${x}px ${y}px)`,
        ];

        const clipPath = isDark ? circlePath : [...circlePath].reverse();
        // 监听过渡动画的就绪状态
        transition.ready.then(() => {
          // 设置动画效果，确保两个方向都有动画
          document.documentElement.animate(
            {
              clipPath,
            },
            {
              duration: 400,
              easing: "ease-out",
              pseudoElement: isDark
                ? "::view-transition-old(root)"
                : "::view-transition-new(root)",
            }
          );
        });
        console.log(transition);

        await transition.finished;
      } catch (error) {
        console.error("View Transitions API error:", error);
        // 降级方案
        switchTheme(newTheme);
      } finally {
        // 无论成功还是失败，重置状态
        setIsTransitioning(false);
      }
    } else {
      switchTheme(newTheme);
      setIsTransitioning(false);
    }
  };

  return (
    <button
      id="themeToggle"
      aria-label="切换主题"
      class={styles.themeToggle}
      onClick={toggleTheme} // 直接使用 SolidJS 的事件绑定
    >
      {/* 太阳图标 */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class={styles.iconSun}
      >
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>

      {/* 月亮图标 */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class={styles.iconMoon}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </button>
  );
};

export default ThemeToggle;
