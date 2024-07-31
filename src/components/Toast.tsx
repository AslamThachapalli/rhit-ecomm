export enum ToastType {
    success = 'bg-teal-500',
    error = 'bg-red-500',
    info = 'bg-yellow-500 ',
}

interface IProps {
    message: string;
    onClose: () => void
    autoDismiss?: boolean
    type?: ToastType
}

export default function Toast({ message, onClose, autoDismiss = true, type = ToastType.error }: IProps) {

    if (autoDismiss) {
        setTimeout(() => {
            onClose()
        }, 2000)
    }

    return (
        <div id="toast-top-right" className="z-20 animate-slide-in-left duration-1000 fixed flex items-center w-full max-w-xs p-4 space-x-4 divide-x rtl:divide-x-reverse rounded-lg top-5 right-5" role="alert">
            <div className={`${type} max-w-x text-sm text-white rounded-xl shadow-lg`} role="alert" tabIndex={-1} aria-labelledby="hs-toast-solid-color-red-label">
                <div id="toast" className="flex p-4">
                    {message}
                    <div className="ms-3">
                        <button onClick={onClose} type="button" className="inline-flex shrink-0 justify-center items-center size-5 rounded-lg text-white hover:text-white opacity-50 hover:opacity-100" aria-label="Close">
                            <span className="sr-only">Close</span>
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