
function UploadFile({ children, setFiles }) {
  return (
    <>
      <label 
        className="flex justify-center items-center block bg-gray-200 shadow-standard text-sm text-gray-700 font-medium h-full w-full px-2 py-1 border-1 border-gray-300 rounded-md cursor-pointer hover:bg-gray-300 duration-200 ease-out" 
        htmlFor="upload-file"
      >
        {children}
      </label>
      <input 
        className="hidden"
        id="upload-file" 
        type="file" 
        onChange={(e) => setFiles(e.target.value)}
      />
    </>
  )
}

export default UploadFile;