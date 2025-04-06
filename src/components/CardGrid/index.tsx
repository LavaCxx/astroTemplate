import type { Component } from 'solid-js';
import type { Card as CardType, Category } from "../../types/index";
import Card from "../Card";
import styles from './CardGrid.module.css';

interface Props {
  categories?: Category[];
  cards?: CardType[];
  title?: string;
  description?: string;
}

const CardGrid: Component<Props> = (props) => {
  return (
    <div class={styles.cardGridContainer}>
      {
        props.title && (
          <h1 class={styles.title}>
            {props.title}
          </h1>
        )
      }
      {props.description && <p class={styles.description}>{props.description}</p>}

      {
        props.categories &&
          props.categories.map((category) => (
            <div class={styles.category}>
              <h2 class={styles.categoryTitle}>{category.name}</h2>
              <div class={styles.cardGrid}>
                {category.cards.map((card) => (
                  <div class={styles.cardWrapper}>
                    <Card card={card} />
                  </div>
                ))}
              </div>
            </div>
          ))
      }

      {
        props.cards && (
          <div class={styles.cardGrid}>
            {props.cards.map((card) => (
              <div class={styles.cardWrapper}>
                <Card card={card} />
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
};

export default CardGrid; 