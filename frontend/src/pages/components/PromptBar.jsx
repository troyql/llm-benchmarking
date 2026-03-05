
function PromptBar({ onSubmit, onUpload, onChange, error, setError, loading }) {
  const onSubmitWrapper = (e) => {
    // only submitting if the enter key is hit alone
    if (e.key === 'Enter' && !e.shiftKey) {
      onSubmit();
    }
  }

  return (
    <div className={`flex items-center shrink-0 rounded-full bg-white border-1 border-gray-300 ${error ? 'outline-red-500 outline-2 shadow-red' : 'outline-0 shadow-standard'} w-4/5 h-14 pl-4 pr-1.5`}>
      <input
        type="text" 
        className="w-full focus:outline-none user-invalid:border-red-500" 
        placeholder="Enter test data description here"
        onKeyDown={onSubmitWrapper}
        onChange={(e) => {
          setError(false);
          onChange(e);
        }}
        onFocus={() => setError(false)}
      />
      <div className="px-1">
        <label htmlFor="test-upload" className="cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5.5 text-gray-500 hover:text-gray-600 duration-300 ease-out">
            <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
          </svg>
        </label>
        <input id="test-upload" type="file" onChange={onUpload} className="hidden" multiple />
      </div>
      <div className="flex justify-between items-center gap-1 cursor-pointer hover:bg-blue-600 duration-200 ease-out bg-blue-500 h-[calc(100%-2*1.5*4px)] rounded-full px-3" onClick={onSubmit}>
        {loading ? 
          <span className="inline-block box-border w-6 h-6 border-x-5 border-gray-100 rounded-full animate-spin"></span>
          :
          <>
            <div className="text-gray-100 font-medium">Generate</div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="text-gray-100 size-5.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </>
        }
      </div>
    </div>
  )
}


export default PromptBar;