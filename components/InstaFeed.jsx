import { useEffect, useState, useRef } from "react";
import styles from "./InstaFeed.module.css";

export default function InstagramFeed() {
  const [posts, setPosts] = useState([]);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef(null);
  const positionRef = useRef(0);
  const animationRef = useRef(null);

  // drag
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  const speed = 0.5; // pixels por frame

  useEffect(() => {
    async function loadFeed() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/instagram/`);
        if (!res.ok) throw new Error("Erro ao carregar o feed do Instagram");
        const data = await res.json();
        setPosts(data.data || []);
      } catch (error) {
        console.error("Erro ao buscar Instagram:", error);
      }
    }

    loadFeed();
  }, []);

  useEffect(() => {
    if (posts.length === 0) return;

    function animate() {
      if (!paused && !isDragging.current && trackRef.current) {
        positionRef.current -= speed;
        const totalWidth = trackRef.current.scrollWidth / 2;
        if (Math.abs(positionRef.current) >= totalWidth) {
          positionRef.current = 0;
        }
        trackRef.current.style.transform = `translateX(${positionRef.current}px)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [posts, paused]);

  // handlers de drag
  const handleMouseDown = (e) => {
    isDragging.current = true;
    setPaused(true);
    startX.current = e.clientX;
    scrollStart.current = positionRef.current;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const delta = e.clientX - startX.current;
    positionRef.current = scrollStart.current + delta;
    trackRef.current.style.transform = `translateX(${positionRef.current}px)`;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    setPaused(false);
  };

  // touch events
  const handleTouchStart = (e) => {
    isDragging.current = true;
    setPaused(true);
    startX.current = e.touches[0].clientX;
    scrollStart.current = positionRef.current;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const delta = e.touches[0].clientX - startX.current;
    positionRef.current = scrollStart.current + delta;
    trackRef.current.style.transform = `translateX(${positionRef.current}px)`;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    setPaused(false);
  };

  return (
    <div
      className={styles.carousel}
      style={{ overflow: "hidden", width: "100%" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeaveCapture={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={trackRef}
        className={styles.trackWrapper}
        style={{
          display: "flex",
          gap: "12px",
          cursor: isDragging.current ? "grabbing" : "grab",
          width: "270px",
          height: "340px",
        }}
      >
        {[...posts, ...posts].map((post, index) => (
          <div key={index} className={styles.card} style={{ minWidth: "300px" }}>
            <a href={post.permalink} target="_blank" rel="noopener noreferrer">
              <img
                src={post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url}
                alt={post.caption?.slice(0, 40) || "Instagram post"}
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
