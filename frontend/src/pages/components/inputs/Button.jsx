
// remember to put a div around the object to specify width & height
// maybe make it so that the div around the button comes with the component,
// but does that work?
function Button({ children, className="", onClick }) {
  return (
    <button 
      className={`${className} bg-blue-500 shadow-blue text-gray-100 font-medium h-full w-full px-2 border-1 border-blue-500 rounded-md cursor-pointer hover:bg-blue-600 duration-200 ease-out`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button;