function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl bg-white/5 border border-white/10 backdrop-blur ${className}`}>
      {children}
    </div>
  )
}

export default Card