'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface DraggableItem {
  id: string;
  type: 'note' | 'emoji' | 'image';
  content: string;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [noteClicked, setIsNoteClicked] = useState(false);

  const [items, setItems] = useState<DraggableItem[]>([
    {
      id: '1',
      type: 'note',
      content: 'To my bestie & soul sister...',
      x: 300,
      y: 100,
      rotation: -5,
      zIndex: 8,
    },
    {
      id: '2',
      type: 'note',
      content: 'Where do we even begin? Thank you for being YOU. Our friendship literally means the world to me and I don\'t know who I\'d be if we hadn\'t met (shoutout ucsb taara). Both our college memories and postgrad memories are incredibly precious \
      and I can\'t wait to keep doing life with you.',
      x: 300,
      y: 100,
      rotation: -2,
      zIndex: 6,
    },
    {
      id: '8',
      type: 'note',
      content: 'You are such an incredible person - beautiful inside & out, with a great sense of humor, and full of so much love. Everyone that has you in their life is truly blessed.',
      x: 300,
      y: 100,
      rotation: 5,
      zIndex: 5,
    },
    {
      id: '3',
      type: 'note',
      content: 'Here\'s to the day we will have partners (SOON) and get to be spoiled by them for valentine\'s 🤪',
      x: 300,
      y: 100,
      rotation: -5,
      zIndex: 3,
    },
    {
      id: '4',
      type: 'note',
      content: 'But until then...will you be my valentine?',
      x: 300,
      y: 100,
      rotation: 0,
      zIndex: 1,
    },
    {
      id: '5',
      type: 'image',
      content: '/IMG_8739.JPG',
      x: 300,
      y: 50,
      rotation: 0,
      zIndex: 4,
    },
    {
      id: '6',
      type: 'image',
      content: '/IMG_5922.JPG',
      x: 300,
      y: 50,
      rotation: 10,
      zIndex: 7,
    },
    {
      id: '7',
      type: 'image',
      content: '/nyc.png',
      x: 300,
      y: 50,
      rotation: 10,
      zIndex: 2,
    },
  ]);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    setDraggingId(id);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    // Bring item to front by setting it to highest z-index
    setItems((prev) => {
      const maxZ = Math.max(...prev.map((i) => i.zIndex));
      return prev.map((item) =>
        item.id === id ? { ...item, zIndex: maxZ + 1 } : item
      );
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId) return;

    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    setItems((prev) =>
      prev.map((item) =>
        item.id === draggingId
          ? { ...item, x: Math.max(0, Math.min(newX, rect.width - 100)), y: Math.max(0, Math.min(newY, rect.height - 100)) }
          : item
      )
    );
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          {!isOpen && <h1 className="mb-2 text-4xl font-bold text-red-600">To a special yookies bear...</h1>}
        </div>

        {!noteClicked ? (
          <div className="flex items-center justify-center">
            <div
              onClick={() => setIsOpen(true)}
              className={`group relative h-64 w-96 cursor-pointer ${styles.envelopeContainer} ${isOpen ? styles.opened : ''}`}
            >
              {/* Envelope body */}
              <div className={`absolute inset-0 rounded-lg shadow-lg transition-transform duration-500 group-hover:scale-105 ${styles.envelopeBody}`}>
                {/* Envelope details */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={`${styles.flapTriangle} ${isOpen ? styles.open : styles.closed} group-hover:scale-100`}
                  ></div>
                </div>
              </div>

              {/* Sticker seal */}
              {!isOpen && <div className={styles.envelopeSticker}>💌</div>}

              {/* Paper slip coming out */}
              <div 
                className={styles.paperSlip}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNoteClicked(true);
                }}
              >
                <p className="text-sm font-semibold text-center text-gray-700">
                  Click to open the letter!
                </p>
              </div>
             
            </div>
          </div>
        ) : (
          <div
            className="relative h-96 overflow-hidden rounded-2xl bg-white p-8 shadow-2xl"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >

            {/* Draggable items */}
            {items.map((item) => (
              <div
                key={item.id}
                className={`${styles.draggableItem} ${draggingId === item.id ? styles.dragging : ''} ${
                  item.type === 'note' ? styles.note : item.type === 'image' ? styles.image : styles.emoji
                }`}
                style={{
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                  transform: `rotate(${item.rotation}deg)`,
                  zIndex: draggingId === item.id ? 50 : item.zIndex,
                }}
                onMouseDown={(e) => handleMouseDown(e, item.id)}
              >
                {item.type === 'note' ? (
                  <div className={styles.noteContent}>
                    <p className={styles.noteText}>
                      {item.content}
                    </p>
                  </div>
                ) : item.type === 'image' ? (
                  <img 
                    src={item.content} 
                    alt="draggable"
                    className={styles.imageContent}
                  />
                ) : (
                  <span className={styles.emojiIcon}>{item.content}</span>
                )}
              </div>
            ))}

            {/* Reset button */}
            
          </div>
        )}
      </div>
      {isOpen && <button
        onClick={() => {
          setIsOpen(false);
          setIsNoteClicked(false);
        }}
        className="absolute bottom-4 middle-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors z-40"
      >
        Reset
      </button>
      }
    </div>
  );
}
