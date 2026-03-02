import React from "react";
import { Card } from "../ui/Card";

interface PowerCard {
  id: string;
  name: string;
  description: string;
}

interface PowerCardsProps {
  cards: PowerCard[];
  onCardClick: (cardId: string) => void;
  usedCards: string[];
}

export function PowerCards({ cards, onCardClick, usedCards }: PowerCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {cards.map((card) => (
        <button
          key={card.id}
          onClick={() => onCardClick(card.id)}
          disabled={usedCards.includes(card.id)}
          className="relative"
        >
          <Card
            className={`h-24 flex flex-col justify-between p-3 transition-all ${
              usedCards.includes(card.id)
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-accent cursor-pointer"
            }`}
          >
            <div className="text-xs font-bold text-accent uppercase">{card.name}</div>
            <div className="text-xs text-foreground/60">{card.description}</div>
          </Card>
        </button>
      ))}
    </div>
  );
}
