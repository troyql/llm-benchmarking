
function TextInput({ placeholder, error, setError, onKeyDown, onChange }) {
  return (
    <div className={`w-full h-full px-2 border-1 border-gray-300 rounded-md shadow-standard text-sm ${error ? 'outline-red-500 outline-2 shadow-red' : 'outline-0 shadow-standard'}`}>
      <input 
        type="text" 
        className="w-full h-full focus:outline-none" 
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        onChange={(e) => {
          setError(false);
          onChange(e);
        }}
        onFocus={() => setError(false)}
      />
    </div>
  )
}

export default TextInput;