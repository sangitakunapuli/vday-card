'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface DraggableItem {
  id: string;
  type: 'note' | 'image';
  content: string;
  x: number;
  y: number;
  rotation: number;
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [noteClicked, setIsNoteClicked] = useState(false);

  const [items, setItems] = useState<DraggableItem[]>([
    {
      id: '1',
      type: 'note',
      content: 'You make every day special! 💕',
      x: 50,
      y: 100,
      rotation: -5,
    },
    {
      id: '2',
      type: 'note',
      content: 'Thanks for being the best friend ever! 🌟',
      x: 150,
      y: 200,
      rotation: 5,
    },
    {
      id: '3',
      type: 'note',
      content: 'Our memories are my favorite! 🎉',
      x: 100,
      y: 150,
      rotation: -3,
    },
    {
      id: '4',
      type: 'image',
      content: '🌹',
      x: 200,
      y: 250,
      rotation: 0,
    },
    {
      id: '5',
      type: 'image',
      content: '💌',
      x: 80,
      y: 300,
      rotation: 10,
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
          {/* {!isOpen && <p className="text-lg text-pink-700">Click to open!</p>} */}
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
                  Click to reveal your surprises!
                </p>
              </div>
      
              {/* Triangular flap */}
             
            </div>
          </div>
        ) : (
          <div
            className="relative h-96 overflow-hidden rounded-2xl bg-white p-8 shadow-2xl"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Background decoration
            <div className="absolute inset-0 opacity-5">
              <div className="text-9xl absolute top-10 left-10">💕</div>
              <div className="text-9xl absolute bottom-10 right-10">💕</div>
            </div> */}

            {/* Draggable items */}
            {items.map((item) => (
              <div
                key={item.id}
                className={`${styles.draggableItem} ${draggingId === item.id ? styles.dragging : ''} ${
                  item.type === 'note' ? styles.note : styles.emoji
                }`}
                style={{
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                  transform: `rotate(${item.rotation}deg)`,
                  zIndex: draggingId === item.id ? 50 : 1,
                }}
                onMouseDown={(e) => handleMouseDown(e, item.id)}
              >
                {item.type === 'note' ? (
                  <div className={styles.noteContent}>
                    <p className={styles.noteText}>
                      {item.content}
                    </p>
                  </div>
                ) : (
                  <span className={styles.emojiIcon}>{item.content}</span>
                )}
              </div>
            ))}

            {/* Reset button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors z-40"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
