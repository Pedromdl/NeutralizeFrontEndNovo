function Card({ title, children, size = 'md', className = '', style = {} }) {
  const sizeClass = `card-${size}`; // ex: card-md, card-lg

  return (
    <div className={`card ${sizeClass} ${className}`} style={style}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}

export default Card;
