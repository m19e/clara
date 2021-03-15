const Loader = () => (
    <div className="min-h-screen min-w-full flex-center bg-gray-100">
        <div className="flex-center w-40 h-40">
            <div className="flex flex-col h-20">
                <div className="loader-before"></div>
                <div className="w-4 h-4"></div>
            </div>
            <div className="loader"></div>
            <div className="flex flex-col h-20">
                <div className="w-4 h-4"></div>
                <div className="loader-after"></div>
            </div>
        </div>
    </div>
);

export default Loader;
