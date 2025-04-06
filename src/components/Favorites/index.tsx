import { createSignal, onMount, createEffect, Show } from 'solid-js';
import type { Component } from 'solid-js';
import type { Card } from '../../types/index';
import styles from './Favorites.module.css';

const Favorites: Component = () => {
  const [favorites, setFavorites] = createSignal<Card[]>([]);
  const [hasFavorites, setHasFavorites] = createSignal(false);
  const [isExpanded, setIsExpanded] = createSignal(false);

  // 加载收藏数据
  const loadFavorites = () => {
    try {
      const favoritesStr = localStorage.getItem('favorites');
      if (favoritesStr) {
        const favoritesData = JSON.parse(favoritesStr);
        setFavorites(favoritesData);
        setHasFavorites(favoritesData.length > 0);
      } else {
        setFavorites([]);
        setHasFavorites(false);
      }
    } catch (error) {
      console.error('加载收藏数据失败:', error);
      setFavorites([]);
      setHasFavorites(false);
    }
  };

  // 切换展开/折叠状态
  const toggleExpand = () => {
    setIsExpanded(!isExpanded());
  };

  onMount(() => {
    loadFavorites();
    
    // 监听收藏变化事件
    window.addEventListener('favorites-changed', loadFavorites);
    
    return () => {
      window.removeEventListener('favorites-changed', loadFavorites);
    };
  });

  return (
    <Show when={hasFavorites()}>
      <div class={`${styles.favorites} ${isExpanded() ? styles.expanded : ''}`}>
        <div class={styles.favoritesHeader}>
          <div class={styles.favoritesHeaderLeft}>
            <h2 class={styles.favoritesTitle}>
              <span class={styles.starIcon}>★</span> 我的收藏
              <button 
                class={styles.expandButton} 
                onClick={toggleExpand} 
                title={isExpanded() ? "收起" : "展开"}
                aria-label={isExpanded() ? "收起" : "展开"}
              >
                {isExpanded() ? '↑' : '↓'}
              </button>
            </h2>
            <div class={styles.favoritesCount}>
              {favorites().length} 项收藏
            </div>
          </div>
        </div>
        
        <div class={styles.favoritesContent}>
          <div class={styles.cardsScroll}>
            {favorites().map(card => (
              <a
                href={card.link}
                class={styles.favCard}
                target={card.iconType === "external" ? "_blank" : "_self"}
                rel={card.iconType === "external" ? "noopener noreferrer" : ""}
              >
                <div class={styles.favCardContent}>
                  <div class={styles.favCardHeader}>
                    <h3 class={styles.favCardTitle}>
                      {card.title}
                    </h3>
                    {card.tags.length > 0 && (
                      <span 
                        class={styles.favCardTag}
                        style={card.tags[0].color ? {
                          'background-color': `${card.tags[0].color}20`,
                          'color': card.tags[0].color
                        } : {}}
                      >
                        {card.tags[0].name}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Show>
  );
};

export default Favorites; 