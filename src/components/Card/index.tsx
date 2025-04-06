import { createSignal, onMount, createEffect } from 'solid-js';
import type { Component } from 'solid-js';
import type { Card as CardType } from '../../types/index';
import styles from './Card.module.css';

interface Props {
  card: CardType;
}

const Card: Component<Props> = (props) => {
  const [isFavorited, setIsFavorited] = createSignal(false);
  
  // 检查卡片是否被收藏
  const checkIfFavorited = () => {
    const favoritesStr = localStorage.getItem('favorites');
    if (favoritesStr) {
      const favorites = JSON.parse(favoritesStr);
      setIsFavorited(favorites.some((fav: CardType) => fav.id === props.card.id));
    }
  };
  
  // 切换收藏状态
  const toggleFavorite = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const favoritesStr = localStorage.getItem('favorites');
    let favorites: CardType[] = [];
    
    if (favoritesStr) {
      favorites = JSON.parse(favoritesStr);
    }
    
    if (isFavorited()) {
      // 取消收藏
      favorites = favorites.filter((fav: CardType) => fav.id !== props.card.id);
    } else {
      // 添加收藏
      favorites.push(props.card);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorited(!isFavorited());
    
    // 发送自定义事件通知收藏变化
    const event = new CustomEvent('favorites-changed');
    window.dispatchEvent(event);
  };
  
  onMount(() => {
    checkIfFavorited();
    
    // 监听收藏变化事件
    window.addEventListener('favorites-changed', checkIfFavorited);
    
    return () => {
      window.removeEventListener('favorites-changed', checkIfFavorited);
    };
  });

  return (
    <a
      href={props.card.link}
      class={styles.card}
      target={props.card.iconType === "external" ? "_blank" : "_self"}
      rel={props.card.iconType === "external" ? "noopener noreferrer" : ""}
    >
      <div class={styles.cardContent}>
        <div class={styles.cardHeader}>
          <h3 class={styles.title}>
            {props.card.title}
          </h3>
          <button 
            class={styles.favoriteButton} 
            onClick={toggleFavorite}
            aria-label={isFavorited() ? "取消收藏" : "收藏"}
            title={isFavorited() ? "取消收藏" : "收藏"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isFavorited() ? "currentColor" : "none"}
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class={styles.favoriteIcon}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        </div>
        <p class={styles.description}>
          {props.card.description}
        </p>

        <div class={styles.footer}>
          <div class={styles.tags}>
            {props.card.tags.map((tag) => (
              <span
                class={styles.tag}
                style={tag.color ? {
                  'background-color': `${tag.color}20`,
                  'color': tag.color
                } : {}}
              >
                {tag.name}
              </span>
            ))}
          </div>

          <div class={styles.icon} aria-hidden="true">
            {props.card.iconType === "external" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class={styles.iconExternal}
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class={styles.iconInternal}
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

export default Card; 