
/*
options is an array of the options (str)
*/
function Dropdown({ options = [], displayedOptions = [] , value, update }) {
  return (
    <select 
      className="border-1 rounded-lg border-gray-300 shadow-standard p-1"
      value={value} 
      onChange={update}
    >
      {options.map((o, i) => 
        <option value={o}>{displayedOptions[i]}</option>
      )}
    </select>
  )
}

export default Dropdown;