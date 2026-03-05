
function Card({ children, className="", title }) {
  return (
    <div className={`${className} border-1 shadow-standard bg-white border-gray-300 rounded-xl p-4`}>
      {children}
    </div>
  )
}

export default Card;