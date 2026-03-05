
function UploadFiles({ children, onChange }) {
  return (
    <>
      <label 
        className="flex justify-center items-center block text-sm text-gray-700 h-full w-full px-2 py-1 cursor-pointer ease-out" 
        htmlFor="upload-file"
      >
        {children}
      </label>
      <input 
        className="hidden"
        id="upload-file" 
        type="file" 
        onChange={onChange}
        multiple
      />
    </>
  )
}

export default UploadFiles;