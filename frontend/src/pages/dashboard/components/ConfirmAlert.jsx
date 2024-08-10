export default function ConfirmAlert() {
  return (
    <div id="dismiss-alert" className="hs-removing:translate-x-5 hs-removing:opacity-0 transition duration-300 bg-teal-50 border border-teal-200 text-sm text-teal-800 rounded-lg p-4" role="alert" tabIndex="-1" aria-labelledby="hs-dismiss-button-label">
        <div className="flex">
            <div className="shrink-0">
            <svg className="shrink-0 size-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
            </svg>
            </div>
            <div className="ms-2">
            <h3 id="hs-dismiss-button-label" className="text-sm font-medium">
                File has been successfully uploaded.
            </h3>
            </div>
            <div className="ps-3 ms-auto">
            <div className="-mx-1.5 -my-1.5">
                <button type="button" className="inline-flex bg-teal-50 rounded-lg p-1.5 text-teal-500 hover:bg-teal-100 focus:outline-none focus:bg-teal-100" data-hs-remove-element="#dismiss-alert">
                <span className="sr-only">Dismiss</span>
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                </svg>
                </button>
            </div>
            </div>
        </div>
    </div>
  )
}
